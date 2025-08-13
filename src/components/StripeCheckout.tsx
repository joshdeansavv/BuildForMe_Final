import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Zap, 
  Crown, 
  Sparkles, 
  Check,
  Loader2,
  ArrowRight
} from 'lucide-react';

interface StripeCheckoutProps {
  guildId: string;
  guildName: string;
  onSuccess?: () => void;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  stripe_price_id: string;
  popular: boolean;
  features: string[];
}

// Configuration-based pricing (easily updatable)
const plans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    description: 'Perfect for small communities getting started',
    price: 0,
    interval: 'forever',
    stripe_price_id: '', // No Stripe needed for free plan
    popular: false,
    features: [
      'Basic bot commands',
      'Server management',
      'Community support',
      'Standard moderation',
      'Basic setup assistance'
    ]
  },
  {
    id: 'ai_premium',
    name: 'AI Premium',
    description: 'Advanced AI-powered features for active communities',
    price: 1199, // $11.99 in cents
    interval: 'month',
    stripe_price_id: import.meta.env.VITE_STRIPE_AI_PREMIUM_PRICE_ID || '',
    popular: true,
    features: [
      'Everything in Free',
      'Advanced AI commands',
      'Smart moderation tools',
      'Custom bot responses',
      'Priority support',
      'Analytics dashboard',
      'Early access features',
      'Custom integrations'
    ]
  }
];

export function StripeCheckout({ guildId, guildName, onSuccess }: StripeCheckoutProps) {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: PricingPlan) => {
    // Handle free plan
    if (plan.id === 'free') {
      toast({
        title: "Free Plan Selected",
        description: "You're already on the free plan! Enjoy basic features.",
      });
      return;
    }

    // If user is not logged in, redirect to auth
    if (!user || !session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe",
      });
      // Redirect to auth page
      window.location.href = '/auth';
      return;
    }

    setLoading(plan.id);

    try {
      // Create checkout session
      const response = await supabase.functions.invoke('stripe-create-checkout', {
        body: {
          // Remove price_id to use dynamic pricing ($59.99)
          guild_id: guildId,
          guild_name: guildName,
          success_url: `${window.location.origin}/dashboard?success=true`,
          cancel_url: `${window.location.origin}/dashboard?canceled=true`,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create checkout session');
      }

      const { url } = response.data;

      // Redirect to Stripe Checkout
      window.location.href = url;

    } catch (error: any) {
      console.error('Error creating checkout session:', error.message || error);
      toast({
        title: "Error",
        description: error.message || "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `$${(price / 100).toFixed(2)}`;
  };

  const getPlanIcon = (plan: PricingPlan) => {
    if (plan.id === 'free') return <Zap className="h-5 w-5" />;
    return <Crown className="h-5 w-5" />;
  };

  const getPlanColor = (plan: PricingPlan) => {
    if (plan.id === 'free') return 'text-blue-500';
    return 'text-purple-500';
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            Choose Your Plan
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {guildName ? `Upgrade ${guildName} to unlock AI-powered features` : 'Select a plan to get started with AI features'}
          </p>
        </div>

        {/* Plans Grid - Optimized for mobile */}
        <div className={`grid gap-4 sm:gap-6 max-w-4xl mx-auto ${
          isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'
        }`}>
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`card-dark relative transition-all duration-300 hover:shadow-lg ${
                plan.popular ? 'ring-2 ring-purple-500/50 shadow-purple-500/20' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4 sm:pb-6">
                <div className="flex items-center justify-center mb-3">
                  <div className={`w-12 h-12 ${getPlanColor(plan)}/10 rounded-xl flex items-center justify-center ${getPlanColor(plan)}`}>
                    {getPlanIcon(plan)}
                  </div>
                </div>
                
                <CardTitle className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {plan.name}
                </CardTitle>
                
                <CardDescription className="text-gray-400 text-sm leading-relaxed">
                  {plan.description}
                </CardDescription>
                
                <div className="mt-4">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white">
                      {formatPrice(plan.price)}
                    </span>
                    {plan.interval !== 'forever' && (
                      <span className="text-gray-400 text-sm sm:text-base">
                        /{plan.interval}
                      </span>
                    )}
                  </div>
                  {plan.interval === 'forever' && (
                    <p className="text-gray-400 text-sm mt-1">No credit card required</p>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4 sm:space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-3 text-center">What's included:</h4>
                  <ul className="space-y-2 sm:space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300 leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading !== null}
                  className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium"
                  variant={plan.popular ? "default" : plan.id === 'free' ? "outline" : "default"}
                >
                  {loading === plan.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {plan.id === 'free' ? (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Current Plan
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Upgrade Now
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Secure payment processing by Stripe • Cancel anytime
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            No setup fees • Instant activation • 24/7 support
          </p>
        </div>
      </div>
    </div>
  );
} 