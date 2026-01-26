import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product, ColorVariant } from "@/data/products";

/**
 * Backwards compatible cart item:
 * - Old code likely expects: id, name, price, image, quantity, slug
 * - New variant-aware code uses: key + selectedVariant
 */
export type CartItem = {
  // Old field (many components expect this)
  id: string;

  // Variant-aware unique key (we also keep this)
  key: string;

  productId?: string;
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

type OldAddItemPayload = {
  id: string; // could already include -variant suffix
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
};

type CartContextType = {
  items: CartItem[];

  // ✅ NEW API
  addToCart: (product: Product, variant?: ColorVariant | null, quantity?: number) => void;
  removeFromCart: (keyOrId: string) => void;
  setQuantity: (keyOrId: string, quantity: number) => void;

  // ✅ OLD API (kept so Header/CartSidebar still works)
  addItem: (item: OldAddItemPayload) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;

  clearCart: () => void;

  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = "jinx_cart_v1";

function normalizeKey(idOrKey: string) {
  // We treat whatever the UI passes (id/key) as the key.
  return idOrKey;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  // ✅ NEW: Add product + optional variant
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
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      }

      const next: CartItem = {
        id: key,     // important: old UI uses id
        key,         // important: new key
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

  // ✅ OLD: Add prebuilt item (what your current Header/CartSidebar likely uses)
  const addItem: CartContextType["addItem"] = (item) => {
    const key = normalizeKey(item.id);

    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + item.quantity } : i));
      }

      const next: CartItem = {
        id: item.id,
        key,
        slug: item.slug,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      };

      return [...prev, next];
    });
  };

  const removeFromCart: CartContextType["removeFromCart"] = (keyOrId) => {
    const key = normalizeKey(keyOrId);
    setItems((prev) => prev.filter((i) => i.key !== key && i.id !== key));
  };

  const removeItem: CartContextType["removeItem"] = (id) => removeFromCart(id);

  const setQuantity: CartContextType["setQuantity"] = (keyOrId, quantity) => {
    const key = normalizeKey(keyOrId);
    setItems((prev) =>
      prev
        .map((i) =>
          i.key === key || i.id === key
            ? { ...i, quantity: Math.max(1, quantity) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const updateQuantity: CartContextType["updateQuantity"] = (id, quantity) => setQuantity(id, quantity);

  const clearCart = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    setQuantity,

    // old API
    addItem,
    removeItem,
    updateQuantity,

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
