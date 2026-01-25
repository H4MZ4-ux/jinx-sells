import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

const CartSidebar = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-foreground/50 z-40"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Cart ({totalItems})
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map(({ product, quantity, selectedColor }) => (
                <div key={`${product.id}-${selectedColor?.slug || 'default'}`} className="flex gap-4 bg-card p-4 rounded-xl border border-border">
                  <img
                    src={selectedColor?.image || product.image}
                    alt={product.name}
                    className="w-20 h-20 object-contain bg-secondary rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    {selectedColor && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span
                          className="w-3 h-3 rounded-full border border-border"
                          style={{ backgroundColor: selectedColor.color }}
                        />
                        {selectedColor.name}
                      </div>
                    )}
                    <p className="text-primary font-semibold">£{product.price}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1, selectedColor?.slug)}
                        className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1, selectedColor?.slug)}
                        className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(product.id, selectedColor?.slug)}
                        className="ml-auto text-muted-foreground hover:text-destructive transition-colors text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>£{totalPrice.toFixed(2)}</span>
            </div>
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-medium"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
