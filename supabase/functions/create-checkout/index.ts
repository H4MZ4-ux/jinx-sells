// supabase/functions/create-checkout/index.ts
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return json({ ok: true });

  try {
    const { email, items, shipping } = await req.json();

    if (!email || !Array.isArray(items) || items.length === 0) {
      return json({ error: "Missing email or items" }, 400);
    }

    const origin = req.headers.get("origin") ?? "http://localhost:5173";

    const line_items = items.map((i: any) => {
      const unitAmount = Math.round(Number(i.price) * 100); // GBP pence
      const qty = Math.max(1, Number(i.quantity || 1));

      if (!Number.isFinite(unitAmount) || unitAmount < 0) {
        throw new Error("Invalid price in items");
      }

      return {
        quantity: qty,
        price_data: {
          currency: "gbp",
          unit_amount: unitAmount,
          product_data: {
            name: String(i.name || "Item"),
            images: i.image ? [String(i.image)] : [],
          },
        },
      };
    });

    const shippingAmount = Math.round(Number(shipping || 0) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: String(email),
      success_url: `${origin}/checkout-success?success=true`,
      cancel_url: `${origin}/cart`,
      line_items,
      shipping_options: shippingAmount > 0 ? [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: shippingAmount, currency: "gbp" },
            display_name: "Shipping",
          },
        },
      ] : undefined,
    });

    return json({ url: session.url });
  } catch (e) {
    console.error(e);
    return json({ error: String(e?.message ?? e) }, 500);
  }
});

