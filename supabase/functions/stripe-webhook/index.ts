import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

interface WebhookPayload {
  type: string
  data: {
    object: any
  }
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    logStep("Webhook received");

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    })

    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      throw new Error('Missing stripe-signature header')
    }

    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    if (!webhookSecret) {
      throw new Error('Missing webhook secret')
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response('Webhook signature verification failed', { status: 400 })
    }

    logStep('Processing webhook event', { type: event.type });

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(supabaseClient, session)
        break
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(supabaseClient, invoice)
        break
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(supabaseClient, invoice)
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(supabaseClient, subscription)
        break
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(supabaseClient, subscription)
        break
      }
      
      default:
        logStep('Unhandled event type', { type: event.type })
    }

    return new Response(
      JSON.stringify({ received: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep('❌ Webhook processing error', { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function handleCheckoutCompleted(supabaseClient: any, session: Stripe.Checkout.Session) {
  logStep("Handling checkout completed", { sessionId: session.id });
  
  try {
    const customerId = session.customer as string;
    const customerEmail = session.customer_email || session.customer_details?.email;
    
    if (!customerEmail) {
      throw new Error('No customer email found in session');
    }

    // Update subscriber status
    await supabaseClient.from("subscribers").upsert({
      email: customerEmail,
      stripe_customer_id: customerId,
      subscription_status: 'active',
      subscription_tier: 'pro',
      subscription_start: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    logStep("✅ Checkout completed successfully", { email: customerEmail });
    
  } catch (error) {
    logStep("❌ Error handling checkout completed", { error: error.message });
    throw error;
  }
}

async function handlePaymentSucceeded(supabaseClient: any, invoice: Stripe.Invoice) {
  logStep("Handling payment succeeded", { invoiceId: invoice.id });
  
  try {
    const customerId = invoice.customer as string;
    const customerEmail = invoice.customer_email;
    
    if (!customerEmail) {
      throw new Error('No customer email found in invoice');
    }

    // Update subscriber payment status
    await supabaseClient.from("subscribers").upsert({
      email: customerEmail,
      stripe_customer_id: customerId,
      subscription_status: 'active',
      last_payment_date: new Date(invoice.created * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    logStep("✅ Payment succeeded handled", { email: customerEmail });
    
  } catch (error) {
    logStep("❌ Error handling payment succeeded", { error: error.message });
    throw error;
  }
}

async function handlePaymentFailed(supabaseClient: any, invoice: Stripe.Invoice) {
  logStep("Handling payment failed", { invoiceId: invoice.id });
  
  try {
    const customerId = invoice.customer as string;
    const customerEmail = invoice.customer_email;
    
    if (!customerEmail) {
      throw new Error('No customer email found in invoice');
    }

    // Update subscriber to expired status
    await supabaseClient.from("subscribers").upsert({
      email: customerEmail,
      stripe_customer_id: customerId,
      subscription_status: 'expired',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    logStep("✅ Payment failed handled", { email: customerEmail });
    
  } catch (error) {
    logStep("❌ Error handling payment failed", { error: error.message });
    throw error;
  }
}

async function handleSubscriptionDeleted(supabaseClient: any, subscription: Stripe.Subscription) {
  logStep("Handling subscription deleted", { subscriptionId: subscription.id });
  
  try {
    const customerId = subscription.customer as string;
    
    // Get customer email from Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    });
    
    const customer = await stripe.customers.retrieve(customerId);
    const customerEmail = (customer as any).email;
    
    if (!customerEmail) {
      throw new Error('No customer email found');
    }

    // Update subscriber to cancelled status
    await supabaseClient.from("subscribers").upsert({
      email: customerEmail,
      stripe_customer_id: customerId,
      subscription_status: 'cancelled',
      subscription_end: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    logStep("✅ Subscription deleted handled", { email: customerEmail });
    
  } catch (error) {
    logStep("❌ Error handling subscription deleted", { error: error.message });
    throw error;
  }
}

async function handleSubscriptionUpdated(supabaseClient: any, subscription: Stripe.Subscription) {
  logStep("Handling subscription updated", { subscriptionId: subscription.id });
  
  try {
    const customerId = subscription.customer as string;
    
    // Get customer email from Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    });
    
    const customer = await stripe.customers.retrieve(customerId);
    const customerEmail = (customer as any).email;
    
    if (!customerEmail) {
      throw new Error('No customer email found');
    }

    // Determine subscription status
    let subscriptionStatus = 'pending';
    if (subscription.status === 'active') {
      subscriptionStatus = 'active';
    } else if (subscription.status === 'canceled') {
      subscriptionStatus = 'cancelled';
    } else if (subscription.status === 'past_due') {
      subscriptionStatus = 'expired';
    }

    // Update subscriber
    await supabaseClient.from("subscribers").upsert({
      email: customerEmail,
      stripe_customer_id: customerId,
      subscription_status: subscriptionStatus,
      subscription_start: new Date(subscription.current_period_start * 1000).toISOString(),
      subscription_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    logStep("✅ Subscription updated handled", { email: customerEmail, status: subscriptionStatus });
    
  } catch (error) {
    logStep("❌ Error handling subscription updated", { error: error.message });
    throw error;
  }
} 