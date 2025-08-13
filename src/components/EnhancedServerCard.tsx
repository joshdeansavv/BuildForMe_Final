import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Server, 
  Users, 
  Crown, 
  Bot, 
  Settings, 
  Trash2, 
  BarChart3,
  MessageSquare,
  Volume2,
  Shield,
  TrendingUp,
  Calendar,
  Zap,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { Guild } from '@/hooks/useDiscordGuilds';
import { useToast } from '@/hooks/use-toast';

interface EnhancedServerCardProps {
  guild: Guild;
  onInviteBot: (guildId: string) => void;
  onRemoveServer?: (guildId: string) => void;
  onManageServer?: (guildId: string) => void;
}

export const EnhancedServerCard: React.FC<EnhancedServerCardProps> = ({
  guild,
  onInviteBot,
  onRemoveServer,
  onManageServer
}) => {
  const { toast } = useToast();
  const [isRemoveLoading, setIsRemoveLoading] = useState(false);

  // Determine bot status
  const botStatus = guild.bot_status || (guild.bot_installed === true ? 'online' : 'not_installed');
  const hasBotInstalled = botStatus !== 'not_installed';

  // Get status color
  const getStatusColor = () => {
    switch (botStatus) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-yellow-400';
      default: return 'text-red-400';
    }
  };

  // Get status text
  const getStatusText = () => {
    switch (botStatus) {
      case 'online': return 'Bot Online';
      case 'offline': return 'Bot Offline';
      default: return 'Bot Not Installed';
    }
  };

  // Handle remove server
  const handleRemoveServer = async () => {
    if (!onRemoveServer) return;
    
    setIsRemoveLoading(true);
    try {
      await onRemoveServer(guild.id);
      toast({
        title: "Server Removed",
        description: `${guild.name} has been removed from your dashboard.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRemoveLoading(false);
    }
  };

  return (
    <Card className={`transition-all duration-200 ${
      hasBotInstalled 
        ? 'hover:bg-[#0b0b0b]' 
        : 'opacity-95 hover:opacity-100'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Avatar className={`h-12 w-12 ring-2 ${
              hasBotInstalled ? 'ring-primary/30' : 'ring-muted/30'
            }`}>
              <AvatarImage src={guild.icon_url || undefined} />
              <AvatarFallback className={`${
                hasBotInstalled ? 'bg-primary/20' : 'bg-muted/20'
              }`}>
                <Server className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-semibold truncate ${
                  hasBotInstalled ? 'text-white' : 'text-muted'
                }`}>
                  {guild.name}
                </h3>
                {guild.owner && (
                  <Crown className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                )}
              </div>
              
              {/* Basic info - always visible */}
              <div className="flex items-center gap-3 text-sm text-muted mb-2">
                <span className="flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  {guild.owner ? "Owner" : "Administrator"}
                </span>
                {hasBotInstalled && guild.analytics && (
                  <>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {guild.analytics.text_channels || 0} text
                    </span>
                    <span className="flex items-center gap-1">
                      <Volume2 className="h-3 w-3" />
                      {guild.analytics.voice_channels || 0} voice
                    </span>
                  </>
                )}
              </div>

              {/* Bot status */}
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${
                  botStatus === 'online' ? 'bg-green-500' :
                  botStatus === 'offline' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className={`text-xs font-medium ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
              </div>

              {/* Analytics for installed bots */}
              {hasBotInstalled && guild.analytics && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-muted/20 rounded-lg p-2">
                    <div className="text-xs text-muted">Commands Today</div>
                    <div className="text-sm font-semibold text-white flex items-center gap-1">
                      <Zap className="h-3 w-3 text-blue-400" />
                      {guild.analytics.commands_used_today || 0}
                    </div>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-2">
                    <div className="text-xs text-muted">Total Roles</div>
                    <div className="text-sm font-semibold text-white flex items-center gap-1">
                      <Shield className="h-3 w-3 text-purple-400" />
                      {guild.analytics.total_roles || 0}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {/* Subscription badge */}
            <Badge 
              variant={guild.subscription_status === 'active' ? 'default' : 'secondary'}
              className={`text-xs ${
                guild.subscription_status === 'active' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {guild.subscription_status === 'active' ? 'Premium' : 'Free'}
            </Badge>

            {/* Action buttons */}
            <div className="flex gap-1">
              {hasBotInstalled ? (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onManageServer?.(guild.id)}
                    className="h-8 w-8 p-0 text-primary hover:text-primary/80"
                    title="Manage Server"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      toast({
                        title: "Analytics",
                        description: "Detailed analytics coming soon!",
                      });
                    }}
                    className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300"
                    title="View Analytics"
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={() => onInviteBot(guild.id)}
                  className="h-8 px-3 rounded-full !rounded-full bg-gray-800/70 hover:bg-gray-800/90 text-gray-200 border border-gray-700/60 hover:border-gray-700/80 text-xs"
                  title="Invite Bot"
                >
                  <Bot className="h-4 w-4 mr-1" />
                  Add Bot
                </Button>
              )}
              
              {onRemoveServer && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleRemoveServer}
                  disabled={isRemoveLoading}
                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                  title="Remove from Dashboard"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Warning for servers without bot */}
        {!hasBotInstalled && (
          <div className="mt-3 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-orange-200">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs">
                Invite the bot to unlock AI features and analytics
              </span>
            </div>
          </div>
        )}

        {/* Quick stats for premium servers */}
        {hasBotInstalled && guild.subscription_status === 'active' && guild.analytics?.last_activity && (
          <div className="mt-3 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-green-200">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">
                Last activity: {new Date(guild.analytics.last_activity).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 