import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Map product slugs to Stripe price IDs
const STRIPE_PRICES: Record<string, string> = {
  "airpods-pro-2": "price_1SsO5HPwgYUi3fez69FVzS09",
  "airpods-pro-3": "price_1SsO5XPwgYUi3feztgwErlrM",
  "airpods-4s": "price_1SsO93PwgYUi3fez5GKj3krF",
  "airpods-max": "price_1SsO9EPwgYUi3fezm0MvaBdM",
  // AirPods Max color variants
  "airpods-max-midnight": "price_1Sss11PwgYUi3fezYtVBkC4L",
  "airpods-max-silver": "price_1Sss1GPwgYUi3fez04IBN6PO",
  "airpods-max-blue": "price_1Sss1sPwgYUi3fezO9f0LkOJ",
  "airpods-max-green": "price_1Sss23PwgYUi3fez0p3y7MYv",
  "airpods-max-pink": "price_1Sss2EPwgYUi3fez3Kk2maPB",
};

interface CartItem {
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, customerEmail } = await req.json() as { 
      items: CartItem[]; 
      customerEmail?: string;
    };

    console.log("[CREATE-CHECKOUT] Starting checkout with items:", items);

    if (!items || items.length === 0) {
      throw new Error("No items provided");
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Build line items - use existing price IDs where available, or price_data for others
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
      const existingPriceId = STRIPE_PRICES[item.slug];
      
      if (existingPriceId) {
        console.log(`[CREATE-CHECKOUT] Using existing price for ${item.slug}: ${existingPriceId}`);
        return {
          price: existingPriceId,
          quantity: item.quantity,
        };
      } else {
        // For products without a Stripe price, use price_data
        console.log(`[CREATE-CHECKOUT] Using price_data for ${item.slug}: £${item.price}`);
        return {
          price_data: {
            currency: "gbp",
            product_data: {
              name: item.name,
              images: [item.image],
            },
            unit_amount: Math.round(item.price * 100), // Convert to pence
          },
          quantity: item.quantity,
        };
      }
    });

    console.log("[CREATE-CHECKOUT] Creating session with line items:", lineItems.length);

    const origin = req.headers.get("origin") || "http://localhost:5173";

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/checkout?success=true`,
      cancel_url: `${origin}/checkout?canceled=true`,
    };

    // Add customer email if provided
    if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log("[CREATE-CHECKOUT] Session created:", session.id);

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
