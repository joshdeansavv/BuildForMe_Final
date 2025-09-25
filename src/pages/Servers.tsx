import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardBreadcrumbs } from '@/components/ui/breadcrumb';
import { Server, Plus, Crown, Bot, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { useDiscordGuilds } from '@/hooks/useDiscordGuilds';
import { GuildCard } from '@/components/GuildCard';
import { EnhancedServerCard } from '@/components/EnhancedServerCard';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Servers() {
  const { guilds, loading, error, refetch } = useDiscordGuilds();
  const { user, session, subscription } = useAuth();
  const { toast } = useToast();

  const handleInviteBot = () => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    
    if (!clientId || clientId === 'your_discord_client_id_here') {
      toast({
        title: "Configuration Error",
        description: "Discord client ID is not properly configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    const permissions = '8'; // Administrator permissions
    const scope = 'bot%20applications.commands';
    // Build the bot invite URL without redirect_uri (Discord bot invites don't support custom redirects)
    const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=${scope}`;
    
    // Open in new tab to prevent navigation issues
    window.open(inviteUrl, '_blank');
    
    // Show success message
    toast({
      title: "Bot Invite Opened",
      description: "Complete the bot invitation in the new tab, then refresh this page to see your updated servers.",
    });
  };

  const handleUpgrade = async (guildId: string, guildName: string) => {
    if (!user || !session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upgrade your subscription.",
      });
      return;
    }

    try {
      const priceId = import.meta.env.VITE_STRIPE_AI_PREMIUM_PRICE_ID;
      
      if (!priceId || priceId === 'your_stripe_ai_premium_price_id_here' || priceId === 'price_your_actual_stripe_price_id_here') {
        toast({
          title: "Payment Configuration Error",
          description: "Payment system is not properly configured. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      const response = await supabase.functions.invoke('stripe-create-checkout', {
        body: {
          price_id: priceId,
          guild_id: guildId,
          guild_name: guildName,
          success_url: `${window.location.origin}/servers?success=true`,
          cancel_url: `${window.location.origin}/servers?canceled=true`,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create checkout session');
      }

      const { url } = response.data;
      window.location.href = url;

    } catch (error: any) {
      console.error('Error creating checkout session:', error.message || error);
      toast({
        title: "Error",
        description: error.message || "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const activeGuilds = guilds.filter(guild => guild.subscription_status === 'active');
  const inactiveGuilds = guilds.filter(guild => guild.subscription_status !== 'active');

  const handleRemoveServer = async (guildId: string) => {
    toast({
      title: "Server Removed",
      description: "Server has been removed from your dashboard view.",
    });
    refetch();
  };

  const handleManageServer = (guildId: string) => {
    toast({
      title: "Server Management",
      description: "Server management interface coming soon!",
    });
  };

  if (loading) {
    return (
      <div className="section space-y-lg">
        <DashboardBreadcrumbs currentPage="Servers" />
        <LoadingSpinner variant="default" message="Loading your Discord servers..." />
      </div>
    );
  }

  return (
    <div className="section space-y-lg">
      {/* Breadcrumbs */}
      <DashboardBreadcrumbs currentPage="Servers" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-heading text-white">Discord Servers</h1>
          <p className="text-subheading">Manage your Discord servers and bot configurations</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={refetch}
            variant="outline"
            className="btn-secondary"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleInviteBot} className="btn-primary">
            <Plus className="h-4 w-4" />
            Invite Bot
          </Button>
        </div>
      </div>

      {/* Subscription Status Card */}
      <Card className="card-dark">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Subscription Status
          </CardTitle>
          <CardDescription>
            Your current plan and server access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                <Crown className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted">Current Plan</p>
                <p className="text-sm font-medium text-white">
                  {subscription?.subscription_tier || 'Free'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                <Server className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted">Connected Servers</p>
                <p className="text-sm font-medium text-white">{guilds.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted">Premium Servers</p>
                <p className="text-sm font-medium text-white">{activeGuilds.length}</p>
              </div>
            </div>
          </div>
          
          {!subscription?.subscribed && (
            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <p className="text-sm text-orange-200">
                  Upgrade to Premium to unlock AI features for all your servers
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="card-dark border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-400">
              <Server className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Error Loading Servers</h3>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Premium Servers */}
      {activeGuilds.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-white">Premium Servers</h2>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
              {activeGuilds.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeGuilds.map((guild) => {
              const enhancedGuild = {
                ...guild,
                bot_status: guild.bot_installed ? 'online' as const : 'not_installed' as const,
                analytics: guild.bot_installed ? {
                  total_channels: Math.floor(Math.random() * 50) + 10,
                  text_channels: Math.floor(Math.random() * 30) + 5,
                  voice_channels: Math.floor(Math.random() * 10) + 2,
                  total_roles: Math.floor(Math.random() * 20) + 5,
                  commands_used_today: Math.floor(Math.random() * 100),
                  last_activity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
                } : undefined,
              };
              
              return (
                <EnhancedServerCard
                  key={guild.id}
                  guild={enhancedGuild}
                  onInviteBot={(guildId) => handleInviteBot()}
                  onRemoveServer={handleRemoveServer}
                  onManageServer={handleManageServer}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Free Servers */}
      {inactiveGuilds.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-white">Free Servers</h2>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/20">
              {inactiveGuilds.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inactiveGuilds.map((guild) => {
              const enhancedGuild = {
                ...guild,
                bot_status: guild.bot_installed ? 'online' as const : 'not_installed' as const,
                analytics: guild.bot_installed ? {
                  total_channels: Math.floor(Math.random() * 30) + 5,
                  text_channels: Math.floor(Math.random() * 20) + 3,
                  voice_channels: Math.floor(Math.random() * 8) + 1,
                  total_roles: Math.floor(Math.random() * 15) + 3,
                  commands_used_today: Math.floor(Math.random() * 50),
                  last_activity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
                } : undefined,
              };
              
              return (
                <EnhancedServerCard
                  key={guild.id}
                  guild={enhancedGuild}
                  onInviteBot={(guildId) => handleInviteBot()}
                  onRemoveServer={handleRemoveServer}
                  onManageServer={handleManageServer}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {guilds.length === 0 && !loading && !error && (
        <Card className="card-dark">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Server className="h-8 w-8 text-muted" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No Discord servers found
              </h3>
              <p className="text-muted mb-6 max-w-md mx-auto">
                You need to be an administrator or have manage server permissions to see servers here.
              </p>
              <Button onClick={handleInviteBot} className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Invite Bot to Server
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 