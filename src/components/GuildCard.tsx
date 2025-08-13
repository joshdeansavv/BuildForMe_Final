import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Server, Users, Crown, Bot, ExternalLink, Settings } from "lucide-react";
import { buildBotInviteUrl, openInDiscordAppFirst } from '@/lib/discord';

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  icon_url: string | null;
  owner: boolean;
  subscription_status: string;
  bot_installed?: boolean;
}

interface GuildCardProps {
  guild: Guild;
  onInviteBot: (guildId: string) => void;
  onManageGuild: (guildId: string) => void;
  onUpgrade: (guildId: string, guildName: string) => void;
}

export const GuildCard: React.FC<GuildCardProps> = ({ 
  guild, 
  onInviteBot, 
  onManageGuild, 
  onUpgrade 
}) => {
  const getBotInviteUrl = () => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    if (!clientId || clientId === 'your_discord_client_id_here') {
      console.error('Discord client ID not configured');
      return '#';
    }
    // Do NOT lock to a specific server; allow user to pick the server in Discord UI
    return buildBotInviteUrl(clientId);
  };

  const getSubscriptionBadge = () => {
    switch (guild.subscription_status) {
      case 'active':
        return <Badge className="bg-green-gradient text-white">Premium</Badge>;
      case 'trial':
        return <Badge className="bg-yellow-gradient text-white">Trial</Badge>;
      default:
        return <Badge variant="outline" className="text-discord-light border-border">Free</Badge>;
    }
  };

  const isBotInstalled = guild.bot_installed === true; // Only show as installed if explicitly true

  return (
            <Card className="backdrop-blur-sm group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 ring-2 ring-discord-blurple/30">
              <AvatarImage src={guild.icon_url || undefined} />
              <AvatarFallback className="bg-discord-gradient text-white font-semibold">
                <Server className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1">
              <CardTitle className="text-white text-lg leading-tight">
                {guild.name}
                {guild.owner && (
                  <Crown className="inline-block h-4 w-4 text-yellow-400 ml-2" />
                )}
              </CardTitle>
              <CardDescription className="text-discord-light text-sm">
                <div className="flex items-center space-x-2">
                  <Crown className="h-3 w-3" />
                  <span>{guild.owner ? "Owner" : "Administrator"}</span>
                </div>
              </CardDescription>
            </div>
          </div>
          
          {getSubscriptionBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-discord-light">Bot Status:</span>
          <div className="flex items-center space-x-2">
            {isBotInstalled ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-400">Installed</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-400">Not Installed</span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {isBotInstalled ? (
            <>
              <Button 
                onClick={() => onManageGuild(guild.id)}
                className="flex-1 bg-discord-gradient hover:bg-blue-600 text-white"
                size="sm"
              >
                <Settings className="mr-2 h-4 w-4" />
                Manage
              </Button>
              
              {guild.subscription_status !== 'active' && (
                <Button 
                  onClick={() => onUpgrade(guild.id, guild.name)}
                  variant="outline"
                  className="flex-1 border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                  size="sm"
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade
                </Button>
              )}
            </>
          ) : (
            <Button 
              onClick={() => {
                const inviteUrl = getBotInviteUrl();
                if (inviteUrl === '#') {
                  console.error('Cannot invite bot: Discord client ID not configured');
                  return;
                }
                openInDiscordAppFirst(inviteUrl);
              }}
              className="w-full rounded-full !rounded-full h-9 bg-green-gradient hover:bg-green-600 text-white text-sm"
              size="sm"
            >
              <Bot className="mr-2 h-4 w-4" />
              Invite Bot
              <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 