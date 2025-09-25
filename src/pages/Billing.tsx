import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, Receipt, ExternalLink, Crown, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Billing = () => {
  const { user, session, subscription, loading } = useAuth();
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
          return_url: `${window.location.origin}/billing`,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 animate-pulse">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          <div className="text-foreground">Loading billing...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and payments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Crown className="w-5 h-5 text-primary" />
              Subscription Status
            </CardTitle>
            <CardDescription>
              Current plan and billing information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <div>
                  {subscription?.subscribed ? (
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Free</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <span className="text-foreground font-medium">
                  {subscription?.subscription_tier || 'Free'}
                </span>
              </div>
              
              {subscription?.subscription_end && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {subscription.subscribed ? 'Next billing' : 'Expired'}
                  </span>
                  <span className="text-foreground font-medium">
                    {format(new Date(subscription.subscription_end), 'MMM dd, yyyy')}
                  </span>
                </div>
              )}

              {subscription?.subscribed && (
                <div className="pt-4 border-t">
                  <Button 
                    onClick={handleManageBilling}
                    disabled={billingLoading}
                    className="w-full"
                  >
                    {billingLoading ? (
                      <>
                        <CreditCard className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Manage Billing
                      </>
                    )}
                  </Button>
                </div>
              )}

              {!subscription?.subscribed && (
                <div className="pt-4 border-t">
                  <Button 
                    onClick={() => window.location.href = '/pricing'}
                    className="w-full"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Receipt className="w-5 h-5 text-primary" />
              Billing History
            </CardTitle>
            <CardDescription>
              Recent payments and invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <Receipt className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-foreground font-medium mb-1">No billing history</p>
              <p className="text-sm text-muted-foreground mb-3">
                {subscription?.subscribed 
                  ? "History will appear after your first payment"
                  : "Subscribe to view billing history"
                }
              </p>
              {subscription?.subscribed && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleManageBilling}
                  disabled={billingLoading}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Invoices
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {subscription?.subscribed && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calendar className="w-5 h-5 text-primary" />
              Subscription Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Status</span>
                <div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    Active
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Plan</span>
                <span className="text-foreground font-medium block">
                  {subscription.subscription_tier || 'Premium'}
                </span>
              </div>
              
              {subscription.subscription_end && (
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">
                    Next billing
                  </span>
                  <span className="text-foreground font-medium block">
                    {format(new Date(subscription.subscription_end), 'MMM dd, yyyy')}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!subscription?.subscribed && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Upgrade to Premium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <Crown className="w-12 h-12 mx-auto mb-4 text-orange-500" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Unlock AI-Powered Features
              </h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Get access to AI server building, advanced analytics, and premium support for just $20/month.
              </p>
              <Button 
                onClick={() => window.location.href = '/pricing'}
                className="w-full max-w-xs"
              >
                <Crown className="w-4 h-4 mr-2" />
                View Pricing Plans
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Billing; 