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
  permissions: number | string;
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
  
  // Performance optimizations
  const isFetchingRef = useRef(false);
  const lastFetchRef = useRef<number>(0);
  const CACHE_DURATION = 2 * 60 * 1000; // Reduced to 2 minutes for faster updates

  // Ensure guilds is always an array
  const safeGuilds = Array.isArray(guilds) ? guilds : [];

  const fetchGuilds = useCallback(async (showToast = false, forceRefresh = false) => {
    if (!user?.id || !session?.access_token) {
      setGuilds([]);
      setLoading(false);
      return;
    }

    // Prevent concurrent requests
    if (isFetchingRef.current) {
      console.log('Discord guilds fetch already in progress, skipping');
      return;
    }

    // Check cache unless forcing refresh
    const now = Date.now();
    if (!forceRefresh && now - lastFetchRef.current < CACHE_DURATION && guilds.length > 0) {
      console.log('Using cached Discord guilds data');
      setLoading(false);
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
        forceRefresh,
        cacheAge: now - lastFetchRef.current
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
      lastFetchRef.current = now;
      
    } catch (err: any) {
      console.error('Error fetching Discord guilds:', err);
      setError(err.message || 'Failed to load Discord servers');
      setGuilds([]); // Ensure we always have an empty array on error
      
      // Show toast notification for errors
      if (showToast) {
        toast({
          title: "Error Loading Servers",
          description: err.message || "Failed to load Discord servers. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [user?.id, session?.access_token, toast, guilds.length]); // Include guilds.length to prevent stale closures

  // Optimized effect with stable dependencies
  useEffect(() => {
    if (!user?.id || !session?.access_token) {
      setGuilds([]);
      setLoading(false);
      return;
    }

    // Immediate fetch without delay for better perceived performance
    fetchGuilds(false, false);
  }, [user?.id, session?.access_token, fetchGuilds]);

  const refetch = useCallback(() => {
    fetchGuilds(true, true); // Force refresh and show toast
  }, [fetchGuilds]);

  return {
    guilds: safeGuilds,
    loading,
    error,
    refetch,
  };
}; 