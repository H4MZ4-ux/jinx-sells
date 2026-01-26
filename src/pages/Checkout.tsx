import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal } = useCart();

  const [email, setEmail] = useState("");

  // ✅ shipping
  const shippingCost = 5; // £5 UK
  const total = useMemo(() => {
    // If cart is empty, keep totals at 0
    if (!items.length) return 0;
    return subtotal + shippingCost;
  }, [items.length, subtotal]);

  const gbp = (amount: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  const onPay = async () => {
    // TODO: your Stripe redirect logic stays here.
    // This fix is only for displayed totals.
    // If you’re creating a Stripe Checkout Session, make sure you send BOTH:
    // - line items subtotal
    // - shipping as a separate line item or shipping option
    console.log("Pay clicked:", { email, subtotal, shippingCost, total });
  };

  // If someone lands here with nothing in cart
  if (!items.length) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="mt-2 text-muted-foreground">Your cart is empty.</p>
          <Button className="mt-6" onClick={() => navigate("/catalog")}>
            Go to Catalog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Cart
        </Link>

        <h1 className="mt-4 text-4xl font-bold">Checkout</h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* LEFT */}
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-xl font-semibold">Contact</h2>

            <label className="mt-6 block text-sm font-medium">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="mt-2 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
              type="email"
            />

            <p className="mt-3 text-sm text-muted-foreground">
              You’ll be redirected to Stripe to complete your payment securely.
            </p>

            <div className="mt-10 rounded-xl border px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
              <CreditCard size={16} />
              Secure payment powered by Stripe
            </div>

            {/* ✅ Pay button now uses TOTAL */}
            <Button className="mt-10 h-14 w-full text-base" onClick={onPay}>
              Pay {gbp(total)}
            </Button>
          </div>

          {/* RIGHT */}
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.key ?? item.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-xl bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </div>
                    </div>
                  </div>

                  <div className="font-medium">{gbp(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            <div className="my-6 border-t" />

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{gbp(subtotal)}</span>
              </div>

              {/* ✅ shipping is numeric now, and displayed */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-primary">{gbp(shippingCost)} UK</span>
              </div>

              <div className="border-t pt-4 flex items-center justify-between">
                <span className="text-xl font-semibold">Total</span>
                {/* ✅ Total includes shipping */}
                <span className="text-2xl font-bold">{gbp(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
