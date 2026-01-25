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
  price: number; // GBP (e.g. 25.00)
  quantity: number;
  image?: string;
}

interface CreateCheckoutBody {
  items: CartItem[];
  customerEmail?: string;
  // sent from the browser so Stripe redirects always return to the correct domain
  origin?: string;
}

function pickSafeOrigin(originFromBody?: string | null, originFromHeader?: string | null) {
  const candidate = (originFromBody || originFromHeader || "").trim();
  if (/^https?:\/\//i.test(candidate)) return candidate.replace(/\/$/, "");
  return "http://localhost:5173";
}

serve(async (req) => {
  // CORS preflight
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
      throw new Error("STRIPE_SECRET_KEY is not set (Supabase -> Edge Functions -> Secrets)");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const body = (await req.json()) as CreateCheckoutBody;
    const items = body?.items ?? [];
    const customerEmail = body?.customerEmail;
    const origin = pickSafeOrigin(body?.origin ?? null, req.headers.get("origin"));

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("No items provided");
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
      if (!item?.name || typeof item.price !== "number" || typeof item.quantity !== "number") {
        throw new Error("Invalid cart item");
      }

      return {
        price_data: {
          currency: "gbp",
          product_data: {
            name: item.name,
            // IMPORTANT: we intentionally do NOT pass images to Stripe because
            // your AirPods Max uses a local asset URL which Stripe rejects.
          },
          unit_amount: Math.round(item.price * 100), // pence
        },
        quantity: item.quantity,
      };
    });

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/checkout?success=true`,
      cancel_url: `${origin}/checkout?canceled=true`,
    };

    if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[CREATE-CHECKOUT] Error:", errorMessage);

    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
