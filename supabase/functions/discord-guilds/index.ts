import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function logStep(message: string, data?: any) {
  console.log(`[${new Date().toISOString()}] ${message}`, data ? JSON.stringify(data) : '');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    logStep("Function started");
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // Get the user from the Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      logStep("❌ No authorization header");
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      logStep("❌ Authentication failed", { error: authError?.message });
      throw new Error('Invalid user token')
    }

    logStep("✅ User authenticated", { userId: user.id });

    // Get provider token from request body
    let requestBody = null;
    try {
      requestBody = await req.json();
    } catch (e) {
      logStep("No request body or invalid JSON", { error: e.message });
      // Body might be empty, that's ok
    }

    // Get Discord access token from request body first, then fallback to user metadata
    const discordAccessToken = requestBody?.provider_token || user.user_metadata?.provider_token
    
    logStep("Discord token check", { 
      hasRequestToken: !!requestBody?.provider_token,
      hasMetadataToken: !!user.user_metadata?.provider_token,
      hasToken: !!discordAccessToken
    });
    
    if (!discordAccessToken) {
      logStep("⚠️ No Discord token found, returning empty guilds");
      return new Response(
        JSON.stringify({ guilds: [] }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    logStep("📡 Fetching Discord guilds");

    // Fetch user's Discord guilds
    const discordResponse = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        'Authorization': `Bearer ${discordAccessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!discordResponse.ok) {
      if (discordResponse.status === 401) {
        logStep("⚠️ Discord token expired");
        // Return empty array if token is expired
        return new Response(
          JSON.stringify({ guilds: [], error: 'Discord token expired' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }
      const errorText = await discordResponse.text().catch(() => 'Unknown error');
      logStep("❌ Discord API error", { status: discordResponse.status, statusText: discordResponse.statusText, body: errorText });
      throw new Error(`Discord API error: ${discordResponse.status} ${discordResponse.statusText}`)
    }

    const guilds = await discordResponse.json()
    logStep("✅ Discord guilds fetched", { count: guilds.length });

    // Filter guilds where user has admin permissions (permission & 0x8)
    const adminGuilds = guilds.filter((guild: any) => {
      const hasAdminPermission = (guild.permissions & 0x8) === 0x8
      const isOwner = guild.owner === true
      return hasAdminPermission || isOwner
    })

    logStep("✅ Admin guilds filtered", { adminCount: adminGuilds.length });

    // Check if bot token is available
    const botToken = Deno.env.get('DISCORD_BOT_TOKEN');
    logStep("🤖 Bot token check", { hasBotToken: !!botToken });

    // For each guild, fetch detailed information if we have bot access
    const enhancedGuilds = await Promise.all(
      adminGuilds.map(async (guild: any) => {
        let detailedGuild = {
          id: guild.id,
          name: guild.name,
          icon: guild.icon,
          owner: guild.owner,
          permissions: guild.permissions,
          features: guild.features || [],
          member_count: guild.approximate_member_count || 0,
          icon_url: guild.icon 
            ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`
            : null,
          bot_installed: false,
          subscription_status: 'none',
          analytics: null,
          bot_status: 'not_installed' as const,
          member_count_warning: false,
        };

        // Try to get detailed guild information using bot token if available
        if (botToken) {
          try {
            const botGuildResponse = await fetch(`https://discord.com/api/guilds/${guild.id}`, {
              headers: {
                'Authorization': `Bot ${botToken}`,
                'Content-Type': 'application/json',
              },
            });

            if (botGuildResponse.ok) {
              const botGuildData = await botGuildResponse.json();
              detailedGuild.member_count = botGuildData.member_count || botGuildData.approximate_member_count || 0;
              detailedGuild.bot_installed = true;
              detailedGuild.bot_status = 'online' as const;
              
              // Get additional analytics from bot
              detailedGuild.analytics = {
                total_channels: botGuildData.channels?.length || 0,
                text_channels: botGuildData.channels?.filter((c: any) => c.type === 0).length || 0,
                voice_channels: botGuildData.channels?.filter((c: any) => c.type === 2).length || 0,
                total_roles: botGuildData.roles?.length || 0,
                commands_used_today: 0, // This would be fetched from activity_logs
                last_activity: new Date().toISOString(),
              };
              
              logStep("✅ Bot guild data fetched", { guildId: guild.id, memberCount: detailedGuild.member_count });
            } else {
              logStep("⚠️ Bot not in guild or no permissions", { guildId: guild.id, status: botGuildResponse.status });
              // Bot is not in the guild or doesn't have permissions
              detailedGuild.bot_installed = false;
              detailedGuild.bot_status = 'not_installed' as const;
            }
          } catch (error) {
            logStep("⚠️ Could not fetch bot guild data", { guildId: guild.id, error: error.message });
            detailedGuild.bot_installed = false;
            detailedGuild.bot_status = 'not_installed' as const;
          }
        } else {
          // No bot token available - use approximate member count and flag the issue
          logStep("⚠️ No bot token available, using approximate member count", { guildId: guild.id });
          detailedGuild.member_count_warning = true;
        }

        return detailedGuild;
      })
    );

    logStep("✅ Enhanced guilds with bot data", { enhancedCount: enhancedGuilds.length });

    // Sync guilds to database
    try {
      for (const guild of enhancedGuilds) {
        await supabaseClient
          .from('guilds')
          .upsert({
            id: guild.id,
            name: guild.name,
            icon: guild.icon,
            owner_id: guild.owner ? user.id : null,
            permissions: guild.permissions.toString(),
            features: guild.features,
            member_count: guild.member_count,
            user_id: user.id,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id,user_id'
          });
      }
      logStep("✅ Guilds synced to database");
    } catch (error) {
      logStep("⚠️ Failed to sync guilds to database", { error: error.message });
    }

    // Check subscription status for each guild
    let guildData = null;
    try {
      const guildIds = enhancedGuilds.map(g => g.id);
      const { data, error } = await supabaseClient
        .from('premium_servers')
        .select('guild_id, status')
        .in('guild_id', guildIds)
        .eq('user_id', user.id);

      if (error) {
        logStep("⚠️ Premium servers query error (non-fatal)", { error: error.message });
      } else {
        guildData = data;
        logStep("✅ Premium servers data fetched", { count: guildData?.length || 0 });
      }
    } catch (e) {
      logStep("⚠️ Premium servers query failed (non-fatal)", { error: e.message });
    }

    // Get activity stats for each guild
    const guildsWithStats = await Promise.all(
      enhancedGuilds.map(async (guild) => {
        let activityStats = null;
        try {
          const { data: stats, error } = await supabaseClient
            .rpc('get_guild_activity_stats', { guild_id_param: guild.id });

          if (!error && stats && stats.length > 0) {
            activityStats = stats[0];
            if (guild.analytics) {
              guild.analytics.commands_used_today = activityStats.total_commands || 0;
              guild.analytics.last_activity = activityStats.last_activity || guild.analytics.last_activity;
            }
          }
        } catch (e) {
          logStep("⚠️ Activity stats query failed (non-fatal)", { guildId: guild.id, error: e.message });
        }

        // Update subscription status
        const premiumServer = guildData?.find(g => g.guild_id === guild.id);
        if (premiumServer && premiumServer.status === 'active') {
          guild.subscription_status = 'active';
        }

        return guild;
      })
    );

    logStep("✅ Guilds processed with activity stats", { finalCount: guildsWithStats.length });

    // Include warnings in the response
    const response = {
      guilds: guildsWithStats,
      warnings: {
        missing_bot_token: !botToken,
        member_count_limited: !botToken,
      }
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    logStep("❌ Critical error in discord-guilds", { 
      message: errorMessage,
      stack: errorStack,
      url: req.url,
      method: req.method
    });
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        guilds: []
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
}) 