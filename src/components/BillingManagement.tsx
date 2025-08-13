import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Crown, 
  Sparkles, 
  Shield, 
  ExternalLink, 
  Loader2,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Lock,
  Globe,
  TrendingUp,
  Heart,
  CheckCircle2,
  ArrowRight,
  Rocket,
  Users,
  BarChart3,
  Zap,
  Bot,
  Settings,
  FileText,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface BillingManagementProps {
  className?: string;
}

export const BillingManagement: React.FC<BillingManagementProps> = ({ className = '' }) => {
  const { user, session, subscription, refreshSubscription } = useAuth();
  const { toast } = useToast();
  const [billingLoading, setBillingLoading] = useState(false);

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
          return_url: `${window.location.origin}/dashboard?tab=billing`,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create billing portal session');
      }

      const { url } = response.data;

      // Redirect to Stripe Customer Portal
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

  const getCurrentPlanStatus = () => {
    if (!user) return null;
    
    if (subscription?.subscribed) {
      return {
        plan: subscription.subscription_tier || 'Premium',
        status: 'Active',
        color: 'text-green-400',
        badgeClass: 'bg-green-900/20 text-green-400 border-green-400/20'
      };
    } else {
      return {
        plan: 'Free',
        status: 'Active',
        color: 'text-blue-400',
        badgeClass: 'bg-blue-900/20 text-blue-400 border-blue-400/20'
      };
    }
  };

  const currentPlan = getCurrentPlanStatus();

  const premiumFeatures = [
    "AI-powered server management",
    "Advanced analytics and insights",
    "Priority support",
    "Unlimited server integrations",
    "Custom bot commands",
    "Advanced moderation tools",
    "24/7 uptime monitoring",
    "Data retention for analytics",
  ];

  if (!user) {
    return (
      <Card className={`card-dark ${className}`}>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-white">Authentication Required</h2>
          <p className="text-gray-400 mb-8 leading-relaxed max-w-md mx-auto">
            Please log in to manage your billing and subscription.
          </p>
          <Button asChild className="w-full bg-white text-black hover:bg-gray-200 h-12 font-semibold">
            <Link to="/auth">
              <Bot className="mr-2 h-4 w-4" />
              Login with Discord
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Clean Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">
          Billing & Subscription
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Manage your subscription and payment settings
        </p>
      </div>

      {/* Trust Signals - Simplified */}
      <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-800 rounded-lg flex items-center justify-center">
            <Lock className="h-3 w-3 text-white" />
          </div>
          <span>SSL Secured</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-800 rounded-lg flex items-center justify-center">
            <Shield className="h-3 w-3 text-white" />
          </div>
          <span>PCI Compliant</span>
        </div>

      </div>

      {/* Current Plan Overview - Simplified */}
      <Card className="card-dark">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
              <Crown className="h-4 w-4 text-white" />
            </div>
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Two-column layout instead of three */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Plan Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Plan</span>
                <Badge className={`${currentPlan?.badgeClass} border cursor-default`}>
                  {currentPlan?.plan}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status</span>
                <span className={`font-medium ${currentPlan?.color}`}>
                  {currentPlan?.status}
                </span>
              </div>

              {subscription?.subscription_end && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Next billing</span>
                  <span className="text-white font-medium">
                    {new Date(subscription.subscription_end).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {subscription?.subscribed ? (
                <Button 
                  onClick={handleManageBilling}
                  disabled={billingLoading}
                  variant="neutral"
                  className="w-full h-12 font-semibold"
                >
                  {billingLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Manage Billing
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  asChild
                  variant="neutral"
                  className="w-full h-12 font-semibold"
                >
                  <Link to="/pricing">
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade Now
                  </Link>
                </Button>
              )}
              
              <Button 
                asChild
                variant="outline"
                className="w-full border-gray-600 text-white hover:bg-gray-800 h-12"
              >
                <Link to="/pricing">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Plans
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Features - Cleaner Grid */}
      <Card className="card-dark">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            Premium Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/20">
                <div className={`w-2 h-2 rounded-full ${subscription?.subscribed ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                <span className={`text-sm ${subscription?.subscribed ? 'text-white' : 'text-gray-400'}`}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Details - Only show if subscribed */}
      {subscription?.subscribed && (
        <Card className="card-dark">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              Subscription Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Active Subscription</p>
                  <p className="text-gray-400 text-sm">Premium features are active</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Next Billing</p>
                  <p className="text-gray-400 text-sm">
                    {subscription.subscription_end 
                      ? new Date(subscription.subscription_end).toLocaleDateString()
                      : 'Not available'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Prompt for Free Users - Simplified */}
      {!subscription?.subscribed && (
        <Card className="card-dark border-blue-500/20">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Unlock Premium Features</h3>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Upgrade to premium for AI-powered server management, advanced analytics, 
              priority support, and much more.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="btn-gradient h-12 font-semibold"
              >
                <Link to="/pricing">
                  <Crown className="mr-2 h-4 w-4" />
                  View Pricing
                </Link>
              </Button>
              <Button 
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800 h-12"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions - Simplified */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="card-dark">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-white font-semibold">Support</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Get help from our support team
            </p>
            <Button 
              asChild
              variant="outline" 
              className="w-full border-gray-600 text-white hover:bg-gray-800"
            >
              <a 
                href="https://discord.gg/4NTc5Pmhhy"
                target="_blank"
                rel="noopener noreferrer"
              >
              <ExternalLink className="mr-2 h-4 w-4" />
                Join support discord server
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 