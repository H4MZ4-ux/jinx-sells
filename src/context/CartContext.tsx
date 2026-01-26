import { createContext, useContext, useState, ReactNode } from "react";
import { Product, ColorVariant } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: ColorVariant;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, selectedColor?: ColorVariant) => void;
  removeFromCart: (productId: number, colorSlug?: string) => void;
  updateQuantity: (productId: number, quantity: number, colorSlug?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const getItemKey = (productId: number, colorSlug?: string) => {
    return colorSlug ? `${productId}-${colorSlug}` : `${productId}`;
  };

  const addToCart = (product: Product, selectedColor?: ColorVariant) => {
    setItems(prev => {
      const existing = prev.find(item => 
        item.product.id === product.id && 
        item.selectedColor?.slug === selectedColor?.slug
      );
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.selectedColor?.slug === selectedColor?.slug
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedColor }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number, colorSlug?: string) => {
    setItems(prev => prev.filter(item => 
      !(item.product.id === productId && item.selectedColor?.slug === colorSlug)
    ));
  };

  const updateQuantity = (productId: number, quantity: number, colorSlug?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, colorSlug);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId && item.selectedColor?.slug === colorSlug
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
