import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product, ColorVariant } from "@/data/products";

export type CartItem = {
  key: string; // unique per product + variant
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedVariant?: {
    slug: string;
    name: string;
    image: string;
  };
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product, variant?: ColorVariant | null, quantity?: number) => void;
  removeFromCart: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "jinx_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addToCart: CartContextType["addToCart"] = (product, variant, quantity = 1) => {
    const variantKey = variant?.slug ? `:${variant.slug}` : "";
    const key = `${product.id}${variantKey}`;

    const selectedVariant = variant
      ? { slug: variant.slug, name: variant.name, image: variant.image }
      : undefined;

    const image = selectedVariant?.image ?? product.image;
    const name = selectedVariant ? `${product.name} - ${selectedVariant.name}` : product.name;

    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + quantity } : i
        );
      }

      const next: CartItem = {
        key,
        productId: product.id,
        slug: product.slug,
        name,
        price: product.price,
        image,
        quantity,
        selectedVariant,
      };

      return [...prev, next];
    });
  };

  const removeFromCart = (key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  };

  const setQuantity = (key: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    setQuantity,
    clearCart,
    totalItems,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
