import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number; // must be a NUMBER
  image?: string;
  quantity: number;
  slug?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "jinx_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        // sanitize
        const cleaned: CartItem[] = parsed
          .filter((x) => x && typeof x.id === "string")
          .map((x) => ({
            id: String(x.id),
            name: String(x.name ?? ""),
            price: Number(x.price ?? 0),
            image: x.image ? String(x.image) : undefined,
            quantity: Math.max(1, Number(x.quantity ?? 1)),
            slug: x.slug ? String(x.slug) : undefined,
          }))
          .filter((x) => Number.isFinite(x.price));

        setItems(cleaned);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addItem = (item: CartItem) => {
    // hard guard against NaN
    const safePrice = Number(item.price);
    if (!Number.isFinite(safePrice)) return;

    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx === -1) return [...prev, { ...item, price: safePrice }];

      const copy = [...prev];
      copy[idx] = {
        ...copy[idx],
        quantity: copy[idx].quantity + (item.quantity || 1),
      };
      return copy;
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    const q = Math.max(1, Number(quantity || 1));
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: q } : p)));
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + Number(i.quantity), 0),
    [items]
  );

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider />");
  return ctx;
}
