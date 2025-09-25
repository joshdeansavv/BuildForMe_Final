import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Guild {
  id: string;
  name: string;
  icon: string | null;
  icon_url: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
  member_count: number;
  subscription_status: string;
  bot_installed?: boolean;
  // Enhanced analytics data
  analytics?: {
    total_channels?: number;
    text_channels?: number;
    voice_channels?: number;
    total_roles?: number;
    bot_joined_date?: string;
    last_activity?: string;
    commands_used_today?: number;
  };
  // Bot presence status
  bot_status?: 'online' | 'offline' | 'not_installed';
  // Enhanced metadata
  premium_features?: string[];
  server_boosts?: number;
  verification_level?: number;
}

export const useDiscordGuilds = () => {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, session } = useAuth();
  const { toast } = useToast();
  
  // Prevent multiple concurrent requests
  const isFetchingRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Ensure guilds is always an array
  const safeGuilds = Array.isArray(guilds) ? guilds : [];

  const fetchGuilds = useCallback(async (showToast = false) => {
    if (!user || !session) {
      setGuilds([]);
      setLoading(false);
      return;
    }

    // Prevent multiple concurrent requests
    if (isFetchingRef.current) {
      console.log('Discord guilds fetch already in progress, skipping');
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      // Get stored Discord provider token
      const discordProviderToken = window.localStorage.getItem('discord_provider_token');
      
      console.log('Fetching Discord guilds...', { 
        hasToken: !!discordProviderToken,
        userId: user.id,
        attempt: retryCountRef.current + 1
      });

      const { data, error: fetchError } = await supabase.functions.invoke('discord-guilds', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          provider_token: discordProviderToken,
        },
      });

      if (fetchError) {
        throw new Error(fetchError.message || 'Failed to fetch Discord guilds');
      }

      // Ensure data is always an array and handle edge cases
      let guildsData: Guild[] = [];
      if (data) {
        if (Array.isArray(data)) {
          guildsData = data;
        } else if (typeof data === 'object' && data !== null) {
          // If data is an object, try to extract guilds from it
          guildsData = Array.isArray(data.guilds) ? data.guilds : [];
        }
      }
      
      console.log('Discord guilds fetched successfully:', { count: guildsData.length });
      setGuilds(guildsData);
      retryCountRef.current = 0; // Reset retry count on success
      
    } catch (err: any) {
      console.error('Error fetching Discord guilds:', err);
      setError(err.message || 'Failed to load Discord servers');
      setGuilds([]); // Ensure we always have an empty array on error
      
      // Retry logic for transient errors
      if (retryCountRef.current < maxRetries && err.message?.includes('non-2xx status code')) {
        retryCountRef.current++;
        console.log(`Retrying Discord guilds fetch (attempt ${retryCountRef.current + 1}/${maxRetries + 1})`);
        
        // Exponential backoff
        setTimeout(() => {
          fetchGuilds(false);
        }, Math.pow(2, retryCountRef.current) * 1000);
        
        return; // Don't show toast or set loading to false during retry
      }
      
      // Show toast notification for persistent errors
      if (showToast) {
        toast({
          title: "Error Loading Servers",
          description: err.message || "Failed to load Discord servers. Please try again.",
          variant: "destructive",
        });
      }
      
      retryCountRef.current = 0; // Reset retry count after max retries
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [user, session, toast]);

  // Fetch guilds when user/session changes, but with a delay to ensure token is available
  useEffect(() => {
    if (!user || !session) {
      setGuilds([]);
      setLoading(false);
      return;
    }

    // Add a small delay to ensure Discord token is stored in localStorage
    const timer = setTimeout(() => {
      fetchGuilds(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user, session, fetchGuilds]);

  const refetch = useCallback(() => {
    fetchGuilds(true);
  }, [fetchGuilds]);

  return {
    guilds: safeGuilds,
    loading,
    error,
    refetch,
  };
}; 