import Stripe from "npm:stripe@14.25.0";

type IncomingItem = {
  slug: string;
  name: string;
  price: number; // GBP (e.g. 25.00)
  quantity: number;
  image?: string;
};

type Body = {
  items: IncomingItem[];
  customerEmail?: string;
  origin: string;
  shippingPrice?: number; // GBP
};

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function gbpToPence(amount: number) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as Body;

    if (!body?.origin || !Array.isArray(body?.items) || body.items.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2024-06-20",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const successPath = Deno.env.get("STRIPE_SUCCESS_PATH") ?? "/checkout?success=true";
    const cancelPath = Deno.env.get("STRIPE_CANCEL_PATH") ?? "/checkout?canceled=true";

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = body.items.map((item) => ({
      price_data: {
        currency: "gbp",
        unit_amount: gbpToPence(item.price),
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : undefined,
          metadata: { slug: item.slug },
        },
      },
      quantity: item.quantity,
    }));

    // ✅ REAL shipping charge
    const shippingPence = gbpToPence(body.shippingPrice ?? 0);
    if (shippingPence > 0) {
      line_items.push({
        price_data: {
          currency: "gbp",
          unit_amount: shippingPence,
          product_data: { name: "Shipping" },
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,

      // Email (customer)
      customer_email: body.customerEmail,

      // ✅ FORCE Stripe Checkout to ask for address & phone
      shipping_address_collection: {
        allowed_countries: ["GB"], // add more if you want
      },
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },

      // Helpful metadata for webhook emails/logs
      metadata: {
        app: "jinx-sells",
      },

      success_url: `${body.origin}${successPath}`,
      cancel_url: `${body.origin}${cancelPath}`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-checkout error", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
