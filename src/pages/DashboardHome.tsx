import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Server, 
  CreditCard,
  Bot,
  Settings,
  ExternalLink,
  Loader2,
  Users,
  Sparkles,
  Shield,
  TrendingUp,
  Plus,
  Zap,
  RefreshCw,
  ArrowDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDiscordGuilds } from '@/hooks/useDiscordGuilds';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { buildBotInviteUrl } from '@/lib/discord';

export default function DashboardHome() {
  const { user, subscription, session, refreshSubscription } = useAuth();
  const { guilds, loading: guildsLoading, refetch: refetchGuilds } = useDiscordGuilds();
  const { toast } = useToast();
  const [billingLoading, setBillingLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [downgradeLoading, setDowngradeLoading] = useState(false);
  const [billingDetails, setBillingDetails] = useState<any>(null);
  const [billingDetailsLoading, setBillingDetailsLoading] = useState(false);

  // Add safety checks for all data
  const isActive = subscription?.subscribed === true;
  const safeGuilds = Array.isArray(guilds) ? guilds : [];

  // Derived stats for Quick Stats
  const totalServers = safeGuilds.length;
  const premiumServers = safeGuilds.filter(g => g.subscription_status === 'active').length;
  const activeBots = safeGuilds.filter(g => g.subscription_status === 'active' || g.bot_installed === true).length;
  const freeServers = Math.max(totalServers - premiumServers, 0);
  const ownedServers = safeGuilds.filter(g => g.owner === true).length;
  const adminOnlyServers = Math.max(totalServers - ownedServers, 0);
  const totalMembers = safeGuilds.reduce((sum, g) => sum + (g.member_count || 0), 0);
  const avgMembers = totalServers > 0 ? Math.round(totalMembers / totalServers) : 0;
  const serversWithoutBot = Math.max(totalServers - safeGuilds.filter(g => g.bot_installed === true).length, 0);

  // Fetch detailed billing information
  const fetchBillingDetails = async () => {
    if (!user || !isActive) return;
    
    setBillingDetailsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        body: { userId: user.id }
      });

      if (error) {
        console.error('Error fetching billing details:', error);
        return;
      }

      setBillingDetails(data);
    } catch (error) {
      console.error('Error fetching billing details:', error);
    } finally {
      setBillingDetailsLoading(false);
    }
  };

  // Load billing details when component mounts and user/subscription changes
  useEffect(() => {
    if (user && isActive) {
      fetchBillingDetails();
    }
  }, [user, isActive]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const canceled = urlParams.get('canceled');

    if (success === 'true') {
      toast({
        title: "Payment Successful!",
        description: "Your premium upgrade has been processed successfully.",
        variant: "default",
      });
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      refreshSubscription();
    }

    if (canceled === 'true') {
      toast({
        title: "Payment Canceled",
        description: "Your payment was canceled. You can try again anytime.",
        variant: "destructive",
      });
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast, refreshSubscription]);

  const handleUpgrade = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upgrade your subscription.",
        variant: "destructive",
      });
      return;
    }

    setUpgradeLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stripe-create-checkout', {
        body: {
          // Remove price_id to use dynamic pricing ($11.99)
          success_url: `${window.location.origin}/dashboard?success=true`,
          cancel_url: `${window.location.origin}/dashboard?canceled=true`,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) {
        // Check if this is a development account
        if (data?.isDevAccount) {
          toast({
            title: "Development Account",
            description: "This account already has premium access for testing purposes.",
            variant: "default",
          });
          return;
        }
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      toast({
        title: "Upgrade Failed",
        description: error instanceof Error ? error.message : "Failed to start upgrade process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpgradeLoading(false);
    }
  };

  const handleManageBilling = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to manage your billing.",
        variant: "destructive",
      });
      return;
    }

    setBillingLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stripe-customer-portal', {
        body: {
          returnUrl: `${window.location.origin}/dashboard`,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) {
        // Check if this is a development account
        if (data?.isDevAccount) {
          toast({
            title: "Development Account",
            description: "This is a free premium development account. Billing management is not available.",
            variant: "default",
          });
          return;
        }
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No billing portal URL returned');
      }
    } catch (error) {
      console.error('Billing portal error:', error);
      toast({
        title: "Billing Portal Error",
        description: error instanceof Error ? error.message : "Failed to open billing portal. Please try again.",
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
        description: "Please log in to manage your subscription.",
      });
      return;
    }

    setDowngradeLoading(true);

    try {
      const response = await supabase.functions.invoke('stripe-cancel-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to cancel subscription');
      }

      // Check if this is a development account
      if (response.data?.isDevAccount) {
        toast({
          title: "✅ Development Account Updated",
          description: "Development account subscription status has been updated for testing purposes.",
        });
      } else {
        toast({
          title: "✅ Subscription Canceled",
          description: "Your subscription will be canceled at the end of the current billing period. You'll still have access to premium features until then.",
        });
      }
      
      refreshSubscription();

    } catch (error: any) {
      console.error('Error canceling subscription:', error.message || error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDowngradeLoading(false);
    }
  };

  const handleRefresh = () => {
    refetchGuilds();
    refreshSubscription();
  };

  const handleInviteBot = () => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    if (!clientId || clientId === 'your_discord_client_id_here') {
      toast({
        title: "Configuration Error",
        description: "Discord client ID is not configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    const inviteUrl = buildBotInviteUrl(clientId);
    window.open(inviteUrl, '_blank', 'noopener');
    toast({
      title: "Bot Invite Opened",
      description: "Complete the bot invitation, then refresh this page.",
    });
  };

  const ServerCard = ({ guild }: { guild: any }) => {
    const hasBot = guild.subscription_status === 'active' || guild.bot_installed === true;

    return (
                      <div className="bg-[#080808] border border-[#1c1c1c] rounded-lg p-3 sm:p-4 backdrop-blur-sm w-full max-w-none sm:max-w-none">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
            <div className="relative">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 ring-2 ring-gray-800/70 flex-shrink-0">
                <AvatarImage src={guild.icon_url} />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white font-semibold">
                  <Server className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </AvatarFallback>
              </Avatar>
              

            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm sm:text-base lg:text-lg truncate">
                {guild.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center text-xs sm:text-sm text-gray-300">
                  <span>{guild.owner ? "Owner" : "Administrator"}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end flex-shrink-0">
            {hasBot ? (
              <Badge className="inline-flex items-center h-8 px-3 rounded-full !rounded-full bg-green-500/15 text-green-300 border border-green-500/30 text-xs">
                <Bot className="h-4 w-4 mr-1" />
                Bot Added
              </Badge>
            ) : (
              <Button
                className="rounded-full !rounded-full bg-gray-800/70 hover:bg-gray-800/90 text-gray-200 border border-gray-700/60 hover:border-gray-700/80 h-8 px-3 text-xs whitespace-nowrap min-w-[92px] transition-colors"
                onClick={() => handleInviteBot()}
              >
                <Plus className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Add Bot</span>
                <span className="sm:hidden">Add</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">

        
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] font-bold mb-4 tracking-tight">
                <span className="text-white block sm:inline">Welcome back, </span>
                <span className="gradient-text-stable gradient-text-animated break-words whitespace-normal align-baseline">{user?.user_metadata?.full_name || user?.email}</span>
              </h1>
              
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Discord Servers */}
          <Card className="shadow-sm discord-servers-card">
            <CardHeader className="pb-3 sm:pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                <Server className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                Your Discord Servers
              </CardTitle>
              <Button
                onClick={handleRefresh}
                disabled={guildsLoading}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800/50 h-8 w-8 p-0 ml-auto rounded-full !rounded-full"
              >
                <RefreshCw className={`h-4 w-4 ${guildsLoading ? 'animate-spin' : ''}`} />
              </Button>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6">
              {guildsLoading ? (
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-400" />
                  <span className="ml-3 text-sm sm:text-base text-gray-400">Loading your servers...</span>
                </div>
              ) : safeGuilds.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Server className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Discord Servers</h3>
                  <p className="text-sm sm:text-base text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
                    You don't have admin permissions on any Discord servers yet. Create your first server or invite our bot to an existing one!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => window.open('https://discord.com/channels/@me', '_blank')}
                      variant="neutral"
                      className="rounded-full !rounded-full h-9 px-4 text-sm"
                    >
                      <Server className="h-4 w-4 mr-1" />
                      Create Server
                    </Button>
                    <Button
                      onClick={() => handleInviteBot()}
                      variant="neutral"
                      className="rounded-full !rounded-full h-9 px-4 text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Bot
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {safeGuilds.map((guild) => (
                    <ServerCard key={guild.id} guild={guild as any} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bottom Cards - Account & Billing and Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Account & Billing */}
            <Card className="shadow-sm flex flex-col">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    Account & Billing
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4 lg:p-6 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-400">Account Status</span>
                  <span className={`text-xs sm:text-sm font-medium ${isActive ? 'text-green-400' : 'text-gray-300'}`}>
                    {isActive ? 'Premium' : 'Free'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-400">Email</span>
                  <span className="text-xs sm:text-sm text-white truncate ml-2">{user?.email}</span>
                </div>

                {/* Billing information for premium users */}
                {isActive && billingDetails && (
                  <div className="mt-2 space-y-2">
                    {billingDetails.current_period_end && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-400">Next Billing</span>
                        <span className="text-xs sm:text-sm text-white">
                          {new Date(billingDetails.current_period_end * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    {billingDetails.cancel_at_period_end && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-400">Status</span>
                        <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                          Cancelling
                        </Badge>
                      </div>
                    )}

                    {billingDetails.customer_email && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-400">Billing Email</span>
                        <span className="text-xs sm:text-sm text-white truncate ml-2">
                          {billingDetails.customer_email}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Subscription usage info for all users */}
                <div className="mt-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-400">User ID</span>
                    <span className="text-xs sm:text-sm text-gray-300 font-mono truncate ml-2">
                      {user?.id?.slice(0, 8)}...
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-400">Member Since</span>
                    <span className="text-xs sm:text-sm text-white">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="block p-3 sm:p-4 lg:p-6 pt-0 mt-auto">
                <div className="w-full">
                  {!isActive ? (
                    <Button
                      onClick={handleUpgrade}
                      disabled={upgradeLoading}
                      variant="neutral"
                      className="w-full font-semibold"
                    >
                      {upgradeLoading ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      )}
                      <span className="whitespace-nowrap">Upgrade to Premium</span>
                    </Button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={handleManageBilling}
                        disabled={billingLoading}
                        variant="neutral"
                        className="flex-1"
                      >
                        {billingLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Settings className="mr-2 h-4 w-4" />
                        )}
                        Manage Billing
                      </Button>
                      <Button
                        onClick={handleDowngrade}
                        disabled={downgradeLoading}
                        className="bg-red-900/40 hover:bg-red-900/60 text-red-200 border border-red-800/50 hover:border-red-800/70 flex-1 transition-colors"
                      >
                        {downgradeLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowDown className="mr-2 h-4 w-4" />
                        )}
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-sm">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  Quick Stats (beta)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-400">Total Servers</span>
                  <span className="text-sm sm:text-base font-semibold text-white">{totalServers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-400">Premium Servers</span>
                  <span className="text-sm sm:text-base font-semibold text-white">{premiumServers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-400">Free Servers</span>
                  <span className="text-sm sm:text-base font-semibold text-white">{freeServers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-400">Owned Servers</span>
                  <span className="text-sm sm:text-base font-semibold text-white">{ownedServers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-400">Admin (not owner)</span>
                  <span className="text-sm sm:text-base font-semibold text-white">{adminOnlyServers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-400">Active Bots</span>
                  <span className="text-sm sm:text-base font-semibold text-white">{activeBots}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-400">Servers Without Bot</span>
                  <span className="text-sm sm:text-base font-semibold text-white">{serversWithoutBot}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-400">Total Members</span>
                  <span className="text-sm sm:text-base font-semibold text-white">{totalMembers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-400">Avg Members / Server</span>
                  <span className="text-sm sm:text-base font-semibold text-white">{avgMembers}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>


      </div>
    </div>
  );
} 