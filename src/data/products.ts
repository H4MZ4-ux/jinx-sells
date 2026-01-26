import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CreditCard, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      clearCart();
      toast({
        title: "Order Confirmed! 🎉",
        description: "Thank you for your purchase. Check your email for confirmation.",
      });
    } else if (searchParams.get("canceled") === "true") {
      toast({
        title: "Payment canceled",
        description: "Your order was not completed.",
        variant: "destructive",
      });
    }
  }, [searchParams, clearCart, toast]);

  const handleCheckout = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const cartItems = items.map(({ product, quantity, selectedColor }) => ({
        slug: selectedColor?.slug || product.slug,
        name: selectedColor ? `${product.name} - ${selectedColor.name}` : product.name,
        price: product.price, // GBP; Edge Function converts to pence
        quantity,
        image: selectedColor?.image || (typeof product.image === "string" ? product.image : undefined),
      }));

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: cartItems,
          customerEmail: email,
          origin: window.location.origin,
        },
      });

      if (error) throw new Error(error.message);

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("No checkout URL returned");
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  if (searchParams.get("success") === "true") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Complete!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for shopping with Jinx Sels. Your order confirmation has been sent to your email.
          </p>
          <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => navigate("/")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold mb-4">Contact</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      You'll be redirected to Stripe to complete your payment securely.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-sm">Secure payment powered by Stripe</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-medium"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Redirecting to payment...
                  </>
                ) : (
                  `Pay £${totalPrice.toFixed(2)}`
                )}
              </Button>
            </div>
          </div>

          <div className="lg:pl-12 lg:border-l border-border">
            <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-8">
              {items.map(({ product, quantity, selectedColor }) => (
                <div key={`${product.id}-${selectedColor?.slug || "default"}`} className="flex gap-4">
                  <div className="relative">
                    <img
                      src={selectedColor?.image || product.image}
                      alt={product.name}
                      className="w-16 h-16 object-contain bg-secondary rounded-lg"
                    />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    {selectedColor && (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-border"
                          style={{ backgroundColor: selectedColor.color }}
                        />
                        {selectedColor.name}
                      </div>
                    )}
                    <p className="text-muted-foreground text-sm">Qty: {quantity}</p>
                  </div>
                  <p className="font-medium">£{(product.price * quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-border">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>£{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-primary">£5 UK</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-3 border-t border-border">
                <span>Total</span>
                <span>£{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
