import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface CartItem {
  slug: string;
  name: string;
  price: number; // GBP
  quantity: number;
}

interface CreateCheckoutBody {
  items: CartItem[];
  customerEmail?: string;
  origin?: string;
}

function safeOrigin(bodyOrigin?: string | null, headerOrigin?: string | null) {
  const origin = bodyOrigin || headerOrigin || "";
  if (/^https?:\/\//.test(origin)) return origin.replace(/\/$/, "");
  return "https://your-domain.com";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const body = (await req.json()) as CreateCheckoutBody;
    const items = body.items ?? [];
    const origin = safeOrigin(body.origin, req.headers.get("origin"));

    if (items.length === 0) throw new Error("No items in cart");

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item) => ({
        price_data: {
          currency: "gbp",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: lineItems,

      // ✅ COLLECT SHIPPING ADDRESS
      shipping_address_collection: {
        allowed_countries: ["GB"],
      },

      // ✅ £3 SHIPPING COST
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 300, // £3.00 in pence
              currency: "gbp",
            },
            display_name: "Standard Shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ],

      success_url: `${origin}/checkout?success=true`,
      cancel_url: `${origin}/checkout?canceled=true`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
