// src/pages/Checkout.tsx

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const SHIPPING_GBP = 5;

function formatGBP(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const total = useMemo(() => subtotal + SHIPPING_GBP, [subtotal]);

  const canPay = items.length > 0 && email.trim().length > 5 && !loading;

  const handlePay = async () => {
    if (!canPay) return;

    try {
      setLoading(true);

      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          items: items.map((i) => ({
            name: i.name,
            price: i.price, // GBP number
            quantity: i.quantity,
            image: i.image,
          })),
          shipping: SHIPPING_GBP,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Checkout failed");
      }

      const data = (await res.json()) as { url?: string };
      if (!data.url) throw new Error("No checkout url returned");

      // Optional: clear cart AFTER Stripe success webhook instead
      // For now keep it simple:
      // clearCart();

      window.location.href = data.url;
    } catch (e) {
      console.error(e);
      alert("Checkout failed. Check your Stripe/Supabase settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <button
          onClick={() => navigate("/cart")}
          className="text-sm text-muted-foreground hover:text-foreground"
          type="button"
        >
          ← Back to Cart
        </button>

        <h1 className="mt-3 text-4xl font-bold">Checkout</h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Left */}
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-xl font-semibold">Contact</h2>

            <label className="mt-5 block text-sm font-medium">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
              placeholder="your@email.com"
              type="email"
            />

            <p className="mt-3 text-sm text-muted-foreground">
              You’ll be redirected to Stripe to complete your payment securely.
            </p>

            <div className="mt-5 rounded-xl border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
              Secure payment powered by Stripe
            </div>

            <Button
              className="mt-8 w-full"
              onClick={handlePay}
              disabled={!canPay}
            >
              {loading ? "Starting checkout..." : `Pay ${formatGBP(total)}`}
            </Button>

            {items.length === 0 ? (
              <p className="mt-3 text-sm text-destructive">
                Your cart is empty.
              </p>
            ) : null}
          </div>

          {/* Right */}
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="h-14 w-14 overflow-hidden rounded-xl bg-muted">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="font-medium">
                    {formatGBP(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatGBP(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{formatGBP(SHIPPING_GBP)}</span>
              </div>

              <div className="mt-3 flex items-center justify-between text-2xl font-bold">
                <span>Total</span>
                <span>{formatGBP(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
