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
  Rocket
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Pricing = () => {
  const { user, session, subscription, refreshSubscription } = useAuth();
  const { toast } = useToast();
  const [billingLoading, setBillingLoading] = useState(false);

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

  return (
    <div className="min-h-screen bg-pure-black py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-gray-800 text-gray-300 px-3 py-1 text-sm font-medium mb-6 border border-gray-700">
            <SparklesIcon className="mr-2 h-3 w-3" />
            Simple Pricing
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Choose Your <span className="gradient-text-animated">Subscription</span>
          </h1>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-8">
              Start free and upgrade when you're ready. No hidden fees, no setup costs. 
              Cancel anytime.
            </p>

            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-400" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span>PCI Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
                <span>No refunds - all sales final</span>
              </div>
            </div>
          </div>
        </div>

      {/* Pricing Cards */}
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        {pricingPlans.map((plan, index) => (
          <Card
            key={index}
            className={`card-dark rounded-xl p-0 transition-all duration-300 hover:shadow-lg border ${
              plan.popular 
                ? 'border-blue-500/50 shadow-blue-500/10' 
                : 'border-gray-700/50'
            }`}
          >
            <div className="flex flex-col h-full p-8 relative">
              {/* Plan Header */}
              <div className="text-center mb-8">
                {plan.popular && (
                  <div className="mb-4">
                    <Badge className="bg-blue-600 text-white px-4 py-1 border-0">
                      <Star className="mr-1 h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {plan.icon === Crown ? (
                    <Crown className="h-6 w-6 text-white" />
                  ) : (
                    <Zap className="h-6 w-6 text-white" />
                  )}
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                
                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-3xl sm:text-4xl font-bold text-white">{plan.price}</span>
                    {plan.billing && (
                      <span className="text-gray-400">{plan.billing}</span>
                    )}
                  </div>
                  {plan.name === "Premium" && (
                    <p className="text-gray-400 text-sm mt-2">Billed monthly • Cancel anytime</p>
                  )}
                </div>
              </div>
              
              {/* Features List */}
              <div className="flex-1 mb-8">
                <h4 className="font-semibold text-white mb-4">What's included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      {feature.included ? (
                        <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-green-400" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 bg-gray-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X className="h-3 w-3 text-gray-500" />
                        </div>
                      )}
                      <span className={`text-sm ${feature.included ? 'text-gray-200' : 'text-gray-500'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            
              {/* CTA Button */}
              <div className="flex justify-center">
                {plan.ctaType === 'dashboard' ? (
                  <Button asChild className="btn-gradient font-bold py-3">
                    <Link to="/dashboard">
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : plan.ctaType === 'auth' ? (
                  <Button asChild className="bg-white text-black hover:bg-gray-200 font-bold py-3">
                    <Link to="/auth">
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : subscription?.subscribed ? (
                  <Button
                    className="bg-gray-700 text-gray-300 cursor-not-allowed font-bold py-3"
                    disabled={true}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Current Subscription
                  </Button>
                ) : (
                  <Button asChild className="btn-gradient font-bold py-3">
                    <Link to="/dashboard">
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto mb-20">
        <div className="text-center mb-12">
          <h2 className="text-heading text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-subheading">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="card-dark">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg text-white">
                  {faq.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm sm:text-base">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="container mx-auto text-center">
        <Card className="card-dark max-w-3xl mx-auto p-8">
          <div className="w-16 h-16 bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-heading text-white mb-6">
            Ready to Transform Your Discord Server?
          </h2>
          <p className="text-subheading mb-8 max-w-3xl mx-auto">
            Join thousands of Discord server owners using BuildForMe. 
            Start free today and upgrade when you're ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button asChild className="btn-gradient px-6 py-3 font-bold">
                <Link to="/dashboard">
                  <Settings className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
            ) : (
              <Button asChild className="btn-gradient px-6 py-3 font-bold">
                <Link to="/auth">
                  <Bot className="mr-2 h-4 w-4" />
                  Get Started Free
                </Link>
              </Button>
            )}
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-6">
            No credit card required • Cancel anytime • No refunds
          </p>
        </Card>
      </div>
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
      { text: "Channel and role management", included: true },
      { text: "Permission checking tools", included: true },
      { text: "Admin command hub", included: true },
      { text: "Community support", included: true },
      { text: "AI-powered server setup", included: false },
      { text: "AI permission optimization", included: false },
      { text: "Advanced server cleanup", included: false },
      { text: "Theme application", included: false },
      { text: "Priority support", included: false },
    ]
  },
  {
    name: "Premium",
    description: "Unlock the full power of AI for professional server management",
    price: "$20",
    billing: "per month",
    icon: Crown,
    popular: true,
    ctaType: "upgrade",
    cta: "Upgrade Now",
    features: [
      { text: "Everything in Free", included: true },
      { text: "AI-powered server setup", included: true },
      { text: "Intelligent permission fixing", included: true },
      { text: "Advanced server cleanup & analysis", included: true },
      { text: "AI theme application", included: true },
      { text: "Smart channel management", included: true },
      { text: "Interactive cleanup tools", included: true },
      { text: "Priority support", included: true },
      { text: "Early access to new features", included: true },
      { text: "Advanced analytics", included: true },
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
    answer: "No setup fees, no hidden costs. Just $20/month for premium features or use the free plan forever. What you see is what you pay."
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