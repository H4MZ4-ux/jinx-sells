// src/context/CartContext.tsx

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;        // MUST be a number (GBP)
  image?: string;
  quantity: number;
  slug?: string;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Partial<CartItem> & { id: string }) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "jinx_cart";

function parsePriceToNumber(value: unknown): number {
  // Accept: 15, "15", "£15", "£15.00", "15.00", etc.
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;

  if (typeof value === "string") {
    // Keep digits + dot only
    const cleaned = value.replace(/[^0-9.]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }

  return 0;
}

function safeText(v: unknown, fallback: string) {
  if (typeof v === "string" && v.trim()) return v.trim();
  return fallback;
}

function normaliseItem(raw: any): CartItem {
  return {
    id: safeText(raw?.id, crypto.randomUUID()),
    name: safeText(raw?.name ?? raw?.title ?? raw?.productName, "Item"),
    price: parsePriceToNumber(raw?.price),
    image: typeof raw?.image === "string" ? raw.image : undefined,
    quantity: Math.max(1, Number(raw?.quantity) || 1),
    slug: typeof raw?.slug === "string" ? raw.slug : undefined,
  };
}

function loadFromStorage(): CartItem[] {
  try {
    const str = localStorage.getItem(STORAGE_KEY);
    if (!str) return [];
    const parsed = JSON.parse(str);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normaliseItem);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadFromStorage());

  // ✅ Repair + persist on any change
  useEffect(() => {
    const repaired = items.map(normaliseItem);
    setItems((prev) => {
      // prevent infinite loops: only set if changed materially
      const prevJson = JSON.stringify(prev);
      const repJson = JSON.stringify(repaired);
      return prevJson === repJson ? prev : repaired;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(repaired));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(items)]);

  const addItem: CartContextValue["addItem"] = (incoming) => {
    const item = normaliseItem(incoming);

    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);

      if (!existing) return [...prev, item];

      return prev.map((p) =>
        p.id === item.id
          ? {
              ...p,
              // keep the latest name/image/price if provided
              name: item.name || p.name,
              image: item.image || p.image,
              price: item.price || p.price,
              quantity: Math.max(1, p.quantity + item.quantity),
            }
          : p
      );
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const setQuantity = (id: string, quantity: number) => {
    const q = Math.max(1, Number(quantity) || 1);
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: q } : p)));
  };

  const clearCart = () => setItems([]);

  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    setQuantity,
    clearCart,
    count,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
