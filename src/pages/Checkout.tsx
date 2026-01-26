// src/pages/Checkout.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard } from "lucide-react";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";

const SHIPPING_GBP = 5;

function toNumber(value: unknown): number {
  // Handles: 15, "15", "£15", "15.00", undefined, null
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^\d.]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function formatGBP(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items } = useCart();
  const [email, setEmail] = useState("");

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = toNumber((item as any).price);
      const qty = Math.max(1, toNumber((item as any).quantity));
      return sum + price * qty;
    }, 0);
  }, [items]);

  const shipping = items.length > 0 ? SHIPPING_GBP : 0;
  const total = subtotal + shipping;

  // For the summary card (just show first item like your UI currently does)
  const firstItem = items[0];

  const onPay = async () => {
    // If you already call your Supabase function here, keep it.
    // This is just the UI fix; your existing checkout creation logic can stay.
    // Add a guard:
    if (!items.length) return;
    // navigate("/payment") or call your existing create-checkout session code
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <button
          type="button"
          onClick={() => navigate("/cart")}
          className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </button>

        <h1 className="text-4xl font-bold">Checkout</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Left */}
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-xl font-semibold">Contact</h2>

            <div className="mt-6">
              <label className="text-sm font-medium">Email</label>
              <Input
                className="mt-2"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="mt-3 text-sm text-muted-foreground">
                You’ll be redirected to Stripe to complete your payment securely.
              </p>
            </div>

            <div className="mt-6 rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CreditCard size={16} />
                Secure payment powered by Stripe
              </div>
            </div>

            <Button
              className="mt-8 w-full"
              onClick={onPay}
              disabled={!items.length}
            >
              Pay {formatGBP(total)}
            </Button>
          </div>

          {/* Right */}
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 overflow-hidden rounded-xl bg-muted">
                  {firstItem?.image ? (
                    <img
                      src={firstItem.image}
                      alt={firstItem.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div>
                  <div className="font-medium">{firstItem?.name ?? "—"}</div>
                  <div className="text-sm text-muted-foreground">
                    Qty: {firstItem?.quantity ?? 0}
                  </div>
                </div>
              </div>

              <div className="text-right font-medium">
                {formatGBP(
                  toNumber(firstItem?.price) * toNumber(firstItem?.quantity)
                )}
              </div>
            </div>

            <div className="my-6 border-t" />

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatGBP(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-primary">
                  {shipping ? `${formatGBP(shipping)} UK` : formatGBP(0)}
                </span>
              </div>
            </div>

            <div className="my-6 border-t" />

            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold">Total</span>
              <span className="text-3xl font-bold">{formatGBP(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
