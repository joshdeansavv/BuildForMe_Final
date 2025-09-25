import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// BuildForMe bot's client ID
const BOT_CLIENT_ID = '1391912825534025879'

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[DISCORD-BOT-INVITE] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
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
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      logStep("Authentication failed", { error: authError?.message });
      throw new Error('Invalid user token')
    }

    logStep("User authenticated", { userId: user.id });

    const { server_id, server_name } = await req.json()

    if (!server_id) {
      throw new Error('Server ID is required')
    }

    logStep("Processing bot invite", { serverId: server_id, serverName: server_name });

    // Generate Discord bot invite URL with proper permissions and guild pre-selection
    const permissions = '8' // Administrator permission
    const scopes = 'bot%20applications.commands'
    const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${BOT_CLIENT_ID}&permissions=${permissions}&scope=${scopes}&guild_id=${server_id}`

    // Log the invite attempt to database
    try {
      const { error: logError } = await supabaseClient
        .from('invite_logs')
        .insert({
          user_id: user.id,
          guild_id: server_id,
          guild_name: server_name || 'Unknown Server',
          invite_url: inviteUrl,
          status: 'pending'
        })

      if (logError) {
        logStep("Warning: Failed to log invite attempt", { error: logError.message });
      } else {
        logStep("Invite attempt logged successfully");
      }
    } catch (error) {
      logStep("Warning: Error logging invite to database", { error: error.message });
      // Don't fail the request if logging fails
    }

    logStep("Bot invite URL generated successfully", { serverId: server_id });

    return new Response(
      JSON.stringify({
        invite_url: inviteUrl,
        bot_name: 'BuildForMe',
        bot_client_id: BOT_CLIENT_ID,
        server_id: server_id,
        server_name: server_name
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("❌ Error in discord-bot-invite", { message: errorMessage });
    return new Response(
      JSON.stringify({ 
        error: errorMessage
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
}) 