import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DashboardBreadcrumbs } from '@/components/ui/breadcrumb';
import { 
  Server, 
  Crown, 
  CreditCard,
  Bot,
  Settings,
  ExternalLink,
  Loader2,
  Users,
  CheckCircle,
  Sparkles,
  Shield,
  TrendingUp,
  Plus,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDiscordGuilds } from '@/hooks/useDiscordGuilds';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function DashboardHome() {
  const { user, subscription, session, refreshSubscription } = useAuth();
  const { guilds, loading: guildsLoading, refetch: refetchGuilds } = useDiscordGuilds();
  const { toast } = useToast();
  const [billingLoading, setBillingLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [billingDetails, setBillingDetails] = useState<any>(null);
  const [billingDetailsLoading, setBillingDetailsLoading] = useState(false);

  // Add safety checks for all data
  const isActive = subscription?.subscribed === true;
  const safeGuilds = Array.isArray(guilds) ? guilds : [];

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
          priceId: 'price_1QZHtJLNKmKWish8JJ6tFjhb', // Your actual price ID
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/dashboard?canceled=true`,
        },
      });

      if (error) {
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
      });

      if (error) {
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

  const handleRefresh = () => {
    refetchGuilds();
    refreshSubscription();
  };

  const handleInviteBot = (guildId?: string) => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID || '1391912825534025879';
    const permissions = '8'; // Administrator permissions
    const scope = 'bot%20applications.commands';
    
    let inviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=${scope}`;
    
    if (guildId) {
      inviteUrl += `&guild_id=${guildId}&disable_guild_select=true`;
    }
    
    window.open(inviteUrl, '_blank');
    
    toast({
      title: "Bot Invite Opened",
      description: "Complete the bot invitation in the new tab, then refresh this page.",
    });
  };

  const ServerCard = ({ guild }: { guild: any }) => {
    const hasBot = guild.subscription_status === 'active' || guild.bot_installed;
    const memberCount = guild.member_count || 0;

    return (
      <div className="bg-gray-800/80 border border-gray-700/50 rounded-lg p-2 sm:p-2.5 backdrop-blur-sm hover:bg-gray-800/90 transition-all max-w-sm sm:max-w-none">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-2">
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <Avatar className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 ring-2 ring-gray-600/50">
              <AvatarImage src={guild.icon_url} />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white font-semibold">
                <Server className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                {guild.name}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mt-0.5 gap-0.5 sm:gap-1">
                {hasBot ? (
                  <div className="flex items-center text-xs sm:text-sm text-gray-300">
                    <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                    <span>{memberCount.toLocaleString()} members</span>
                  </div>
                ) : (
                  <span className="text-xs sm:text-sm text-gray-400">Bot not installed</span>
                )}
                
                {guild.owner && (
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs w-fit">
                    <Crown className="h-3 w-3 mr-1" />
                    Owner
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end sm:justify-start">
            {hasBot ? (
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs sm:text-sm">
                <Bot className="h-3 w-3 mr-1" />
                Active
              </Badge>
            ) : (
              <Button
                className="btn-secondary"
                onClick={() => handleInviteBot(guild.id)}
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Add Bot
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
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
                <span className="text-white">Welcome back, </span>
                <span className="gradient-text-animated break-words">{user?.user_metadata?.full_name || user?.email}</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-400">
                {isActive ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Premium Plan Active
                  </span>
                ) : (
                  "Manage your Discord servers and upgrade for premium features"
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                onClick={handleRefresh}
                disabled={guildsLoading}
                className="btn-secondary"
              >
                <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${guildsLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Discord Servers */}
          <Card className="bg-gray-900/40 border-gray-600/30 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                <Server className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                Your Discord Servers
              </CardTitle>
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
                      className="btn-primary"
                    >
                      <Server className="h-4 w-4 mr-2" />
                      Create Server
                    </Button>
                    <Button
                      onClick={() => handleInviteBot()}
                      className="btn-secondary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
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
            <Card className="bg-gray-900/40 border-gray-600/30 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    Account & Billing
                  </CardTitle>
                  <Button
                    onClick={handleManageBilling}
                    disabled={billingLoading}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8 p-0"
                  >
                    {billingLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Settings className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-400">Plan Status</span>
                  <Badge className={`${
                    isActive 
                      ? 'badge-gradient' 
                      : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                  } text-xs`}>
                    {isActive ? 'Premium' : 'Free'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-400">Email</span>
                  <span className="text-xs sm:text-sm text-white truncate ml-2">{user?.email}</span>
                </div>

                {/* Enhanced billing information for premium users */}
                {isActive && (
                  <>
                    <div className="border-t border-gray-600/30 pt-3 space-y-3">
                      {billingDetailsLoading ? (
                        <div className="flex items-center justify-center py-2">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                          <span className="ml-2 text-xs text-gray-400">Loading billing details...</span>
                        </div>
                      ) : billingDetails ? (
                        <>
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
                        </>
                      ) : (
                        <div className="text-xs text-gray-400 text-center py-2">
                          Unable to load billing details
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Subscription usage info for all users */}
                <div className="border-t border-gray-600/30 pt-3 space-y-3">
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

                {!isActive && (
                  <div className="pt-2">
                    <Button
                      onClick={handleUpgrade}
                      disabled={upgradeLoading}
                      className="btn-gradient w-full"
                    >
                      {upgradeLoading ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      )}
                      <span className="whitespace-nowrap">Upgrade now</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gray-900/40 border-gray-600/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-400">Total Servers</span>
                  <span className="text-sm sm:text-base font-semibold text-white">{safeGuilds.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-400">Active Bots</span>
                  <span className="text-sm sm:text-base font-semibold text-white">
                    {safeGuilds.filter(g => g.subscription_status === 'active' || g.bot_installed).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-400">Plan Status</span>
                  <Badge className={`${
                    isActive 
                      ? 'badge-gradient' 
                      : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                  } text-xs`}>
                    {isActive ? 'Premium' : 'Free'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 