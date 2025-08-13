import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  X, 
  Zap, 
  Crown, 
  Bot, 
  Loader2, 
  CreditCard, 
  Settings, 
  ArrowRight,
  Sparkles,
  Shield,
  Users,
  BarChart3,
  Clock,
  Star,
  AlertCircle,
  ExternalLink,
  Lock,
  Globe,
  TrendingUp,
  Heart,
  CheckCircle2,
  ArrowUpRight,
  Sparkles as SparklesIcon,
  Rocket,
  ArrowDown,
  CheckCircle,
  User
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Pricing = () => {
  const { user, session, subscription, refreshSubscription } = useAuth();
  const { toast } = useToast();
  const [billingLoading, setBillingLoading] = useState(false);
  const [downgradeLoading, setDowngradeLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  // Check for success/canceled parameters from Stripe
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast({
        title: "🎉 Payment Successful!",
        description: "Your subscription has been activated. AI features are now available.",
      });
      refreshSubscription();
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('canceled') === 'true') {
      toast({
        title: "Payment Canceled",
        description: "Your payment was canceled. You can try again anytime.",
        variant: "destructive",
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast, refreshSubscription]);

  const handleManageBilling = async () => {
    if (!user || !session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to manage your billing.",
      });
      return;
    }

    setBillingLoading(true);

    try {
      const response = await supabase.functions.invoke('stripe-customer-portal', {
        body: {
          return_url: `${window.location.origin}/pricing`,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        // Check if this is a development account
        if (response.data?.isDevAccount) {
          toast({
            title: "Development Account",
            description: "This is a free premium development account. Billing management is not available.",
            variant: "default",
          });
          return;
        }
        throw new Error(response.error.message || 'Failed to create billing portal session');
      }

      const { url } = response.data;
      window.location.href = url;

    } catch (error: any) {
      console.error('Error creating billing portal session:', error.message || error);
      toast({
        title: "Error",
        description: error.message || "Failed to access billing portal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBillingLoading(false);
    }
  };

  const handleDowngrade = async () => {
    if (!user || !session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to downgrade your subscription.",
      });
      return;
    }

    setDowngradeLoading(true);

    try {
      const response = await supabase.functions.invoke('stripe-downgrade', {
        body: {
          return_url: `${window.location.origin}/pricing`,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to downgrade subscription');
      }

      const { url } = response.data;
      window.location.href = url;

    } catch (error: any) {
      console.error('Error downgrading subscription:', error.message || error);
      toast({
        title: "Error",
        description: error.message || "Failed to downgrade subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDowngradeLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!user || !session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upgrade your subscription.",
      });
      return;
    }

    setUpgradeLoading(true);

    try {
      const response = await supabase.functions.invoke('stripe-upgrade', {
        body: {
          return_url: `${window.location.origin}/pricing`,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to upgrade subscription');
      }

      const { url } = response.data;
      window.location.href = url;

    } catch (error: any) {
      console.error('Error upgrading subscription:', error.message || error);
      toast({
        title: "Error",
        description: error.message || "Failed to upgrade subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpgradeLoading(false);
    }
  };

  const getButtonForPlan = (planName: string) => {
    if (!user) {
      if (planName === "Free") {
          return (
            <Button asChild variant="neutral" className="w-full transition-all duration-200 hover:scale-105">
            <Link to="/auth">
              <User className="w-4 h-4 mr-2 text-white" />
              Get Started
            </Link>
          </Button>
        );
      } else if (planName === "Premium") {
          return (
            <Button asChild variant="neutral" className="w-full transition-all duration-200 hover:scale-105">
            <Link to="/auth">
              <Crown className="w-4 h-4 mr-2 text-white" />
              Upgrade to Premium
            </Link>
          </Button>
        );
      }
    }

    const isPremium = subscription?.subscription_status === 'active';

    if (planName === "Free") {
      if (!isPremium) {
        return (
          <Button disabled className="w-full bg-gray-800/60 text-gray-400 cursor-not-allowed border border-gray-700 rounded-full">
            <CheckCircle className="w-4 h-4 mr-2" />
            Current Plan
          </Button>
        );
      } else {
        return (
          <Button 
            onClick={() => handleDowngrade()} 
            disabled={downgradeLoading}
            className="w-full bg-red-900/60 hover:bg-red-900/80 text-white border border-red-800 rounded-full transition-all duration-200 hover:scale-105"
          >
            {downgradeLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Downgrading...
              </>
            ) : (
              <>
                <ArrowDown className="w-4 h-4 mr-2" />
                Downgrade to Free
              </>
            )}
          </Button>
        );
      }
    } else if (planName === "Premium") {
      if (isPremium) {
        return (
          <Button disabled className="w-full bg-gray-800/60 text-gray-400 cursor-not-allowed border border-gray-700 rounded-full">
            <CheckCircle className="w-4 h-4 mr-2" />
            Current Plan
          </Button>
        );
      } else {
        return (
          <Button 
            onClick={() => handleUpgrade()} 
            disabled={upgradeLoading}
            className="w-full rounded-full transition-all duration-200 hover:scale-105" variant="neutral"
          >
            {upgradeLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Upgrading...
              </>
            ) : (
              <>
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </>
            )}
          </Button>
        );
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-pure-black relative overflow-hidden">


      {/* Main content wrapper */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-20 xl:py-24">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="max-w-6xl mx-auto text-center">
              <div className="space-y-3 lg:space-y-4">
                {/* Hero Headline with gradient text animation */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                  Choose Your
                  <span className="block gradient-text-animated">
                    Subscription
                  </span>
                </h1>
                
                {/* Hero Subtitle */}
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-400 leading-relaxed max-w-3xl mx-auto text-wrap-balance">
                  Start free and upgrade when you're ready
                </p>

                {/* Trust indicators */}
                <div className="flex items-center gap-6 text-sm text-gray-400 justify-center flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-2.5 w-2.5 text-white" />
                    </div>
                    <span>Free plan available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-2.5 w-2.5 text-white" />
                    </div>
                    <span>Premium AI features</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full py-12 bg-black">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

          {/* Simplified Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className="bg-[#080808] border-[#1c1c1c] rounded-xl p-0"
              >
                <div className="flex flex-col h-full p-4 sm:p-6 relative">
                  {/* Simplified Plan Header */}
                  <div className="text-center mb-4">
                    
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 leading-relaxed">{plan.description}</p>
                    
                    {/* Simplified Pricing */}
                    <div className="mb-4">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-2xl sm:text-3xl font-bold text-white">{plan.price}</span>
                        {plan.billing && (
                          <span className="text-gray-400 text-xs sm:text-sm">{plan.billing}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Simplified Features List - Show only key features */}
                  <div className="flex-1 mb-4">
                    <ul className="space-y-2">
                      {plan.features.slice(0, 6).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2">
                          {feature.included ? (
                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-green-400" />
                            </div>
                          ) : (
                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <X className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-gray-500" />
                            </div>
                          )}
                          <span className={`text-xs sm:text-sm leading-relaxed ${feature.included ? 'text-gray-200' : 'text-gray-500'}`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                
                  {/* Simplified CTA Button */}
                  <div className="flex justify-center">
                    {getButtonForPlan(plan.name)}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Simplified FAQ Section - Show only 3 key questions */}
          <div className="mb-6 sm:mb-8">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
                Common Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.slice(0, 3).map((faq, index) => (
                <div
                  key={index}
                  className="bg-[#080808] border border-[#1c1c1c] rounded-lg p-3 sm:p-4"
                >
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Simplified Final CTA */}
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3">
              Ready to get started?
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-3">
              {user ? (
                <Button asChild variant="neutral" className="px-4 py-2 font-bold rounded-full transition-all duration-200 hover:scale-105 text-sm">
                  <Link to="/dashboard">
                    <Settings className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="neutral" className="px-4 py-2 font-bold rounded-full transition-all duration-200 hover:scale-105 text-sm">
                  <Link to="/auth">
                    <Bot className="mr-2 h-4 w-4" />
                    Get Started Free
                  </Link>
                </Button>
              )}
            </div>
            <p className="text-gray-500 text-xs">
              No credit card required
            </p>
          </div>
        </div>
      </div>
        </section>
      </div>
    </div>
  );
};

const pricingPlans = [
  {
    name: "Free",
    description: "Perfect for getting started with basic server management",
    price: "$0",
    billing: "Forever free",
    icon: Zap,
    popular: false,
    ctaType: "auth",
    cta: "Get Started Free",
    features: [
      { text: "Basic server setup commands", included: true },
      { text: "Channel management (manual)", included: true },
      { text: "Role management (manual)", included: true },
      { text: "Permission security tools", included: true },
      { text: "Admin command hub", included: true },
      { text: "Server management tools", included: true },
      { text: "Backup & restore functionality", included: true },
      { text: "Message & reaction cleanup", included: true },
      { text: "Community support", included: true },
      { text: "AI-powered server setup", included: false },
      { text: "AI channel management", included: false },
      { text: "AI role management", included: false },
      { text: "AI permission optimization", included: false },
      { text: "Interactive AI cleanup", included: false },
      { text: "AI theme application", included: false },
      { text: "AI analytics & insights", included: false },
      { text: "Priority support", included: false },
    ]
  },
  {
    name: "Premium",
    description: "Unlock the full power of AI for professional server management",
    price: "$11.99",
    billing: "per month",
    icon: Crown,
    popular: true,
    ctaType: "upgrade",
    cta: "Upgrade Now",
    features: [
      { text: "Everything in Free", included: true },
      { text: "AI-powered server setup", included: true },
      { text: "AI channel management", included: true },
      { text: "AI role management", included: true },
      { text: "AI permission optimization", included: true },
      { text: "Interactive AI cleanup", included: true },
      { text: "AI theme application", included: true },
      { text: "AI analytics & insights", included: true },
      { text: "Channel summaries & sentiment analysis", included: true },
      { text: "Topic mapping & daily digests", included: true },
      { text: "Q&A extraction & meeting minutes", included: true },
      { text: "Priority support", included: true },
      { text: "Early access to new features", included: true },
    ]
  }
];

const faqs = [
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes! You can cancel your subscription at any time through your billing portal. Your premium features will remain active until the end of your current billing period, then your account will automatically switch to the free plan."
  },
  {
    question: "Do you offer refunds?",
    answer: "No, we do not offer refunds. All sales are final. We recommend trying our free tier first to ensure BuildForMe meets your needs before upgrading to premium."
  },
  {
    question: "What happens if I don't pay?",
    answer: "If payment fails, your account will be automatically downgraded to the free plan. You'll lose access to premium AI features but can still use all basic functionality."
  },
  {
    question: "Can I use the bot on multiple servers?",
    answer: "Yes! Both free and premium plans allow you to use BuildForMe on unlimited Discord servers. Premium features apply to all servers where you have admin permissions."
  },
  {
    question: "Is there a setup fee?",
    answer: "No setup fees, no hidden costs. Just $11.99/month for premium features or use the free plan forever. What you see is what you pay."
  },
  {
    question: "How do I manage my billing?",
    answer: "If you're a premium subscriber, you can manage your billing, update payment methods, and cancel your subscription through the billing portal accessible from your dashboard or this pricing page."
  },
  {
    question: "Is my payment information secure?",
    answer: "Absolutely. We use Stripe for all payment processing, which is PCI DSS compliant and trusted by millions of businesses worldwide. Your payment information is never stored on our servers."
  }
];

export default Pricing;