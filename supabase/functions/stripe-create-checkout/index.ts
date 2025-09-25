import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    // Parse request body to get parameters
    const body = await req.json();
    const { price_id, guild_id, guild_name, success_url, cancel_url } = body;
    
    logStep("Request parameters", { price_id, guild_id, guild_name, success_url, cancel_url });

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check if this is a development account with existing premium access
    const { data: subscriber } = await supabaseClient
      .from("subscribers")
      .select("discord_username, subscription_status")
      .eq("email", user.email)
      .single();

    const developmentAccounts = ['joshdeanpro', 'aidenbgegos'];
    const isDevAccount = subscriber?.discord_username && 
                        developmentAccounts.includes(subscriber.discord_username);

    if (isDevAccount && subscriber?.subscription_status === 'active') {
      logStep("🎯 Development account with active premium detected", { username: subscriber.discord_username });
      
      return new Response(JSON.stringify({ 
        error: "Development account already has premium access. No upgrade needed.",
        isDevAccount: true 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2023-10-16" });
    
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    }

    // Prepare line items - use price_id if provided, otherwise use dynamic pricing
    const lineItems = price_id ? [
      {
        price: price_id,
        quantity: 1,
      },
    ] : [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "BuildForMe Pro Subscription" },
          unit_amount: 1199, // $11.99
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "subscription",
      success_url: success_url || `${req.headers.get("origin")}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${req.headers.get("origin")}/dashboard`,
    });

    logStep("Checkout session created", { sessionId: session.id });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});