import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Subscription {
  subscribed: boolean;
  subscription_status: string;
  subscription_end?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscription: Subscription | null;
  refreshSubscription: () => Promise<void>;
  signOut: () => Promise<void>;
  clearAuthState: () => void;
  createProfileManually: () => Promise<boolean>;
  checkProfileExists: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('subscription_status, subscription_end')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        setSubscription({ subscribed: false, subscription_status: 'inactive' });
        return;
      }

      const subscription = data ? {
        subscribed: data.subscription_status === 'active',
        subscription_status: data.subscription_status || 'inactive',
        subscription_end: data.subscription_end,
      } : { subscribed: false, subscription_status: 'inactive' };

      setSubscription(subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription({ subscribed: false, subscription_status: 'inactive' });
    }
  };

  const refreshSubscription = async () => {
    await fetchSubscription(user?.id || '');
  };

  useEffect(() => {
    // Set up auth state listener - synchronous only to prevent deadlock
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id || 'no user');
        setSession(session);
        setUser(session?.user ?? null);
        
        // Store Discord provider token when user signs in
        if (session && session.provider_token) {
          console.log('Storing Discord provider token');
          window.localStorage.setItem('discord_provider_token', session.provider_token);
        }

        if (session && session.provider_refresh_token) {
          console.log('Storing Discord provider refresh token');
          window.localStorage.setItem('discord_provider_refresh_token', session.provider_refresh_token);
        }

        if (event === 'SIGNED_OUT') {
          console.log('Removing stored Discord tokens');
          window.localStorage.removeItem('discord_provider_token');
          window.localStorage.removeItem('discord_provider_refresh_token');
        }
        
        if (event === 'SIGNED_IN' && session) {
          setTimeout(() => {
            fetchSubscription(session.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setSubscription(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id || 'no user');
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        fetchSubscription(session.user.id);
      }
      setLoading(false);
    });

    return () => authSubscription.unsubscribe();
  }, []);

  // Separate effect to handle profile creation/update
  useEffect(() => {
    const createOrUpdateProfile = async (user: User) => {
      console.log('Creating/updating profile for user:', user.id);
      console.log('User metadata:', user.user_metadata);
      
      const discordData = user.user_metadata;
      
      // Extract Discord data with better fallbacks
      const profileData = {
        id: user.id,
        discord_id: discordData?.provider_id || discordData?.sub || discordData?.id,
        username: discordData?.global_name || discordData?.username || discordData?.full_name || discordData?.preferred_username || discordData?.name || user.email?.split('@')[0] || 'Discord User',
        avatar_url: discordData?.avatar_url || discordData?.picture,
        email: user.email,
      };

      console.log('Profile data to upsert:', profileData);

      try {
        const { data, error } = await supabase
          .from('profiles')
          .upsert(profileData, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          })
          .select();

        if (error) {
          console.error('Profile upsert error:', error);
          console.error('Error details:', error.message, error.details, error.hint);
        } else {
          console.log('Profile upserted successfully:', data);
        }
      } catch (error) {
        console.error('Error in createOrUpdateProfile:', error);
      }
    };

    // Only create/update profile when user is available and not loading
    if (user && !loading) {
      createOrUpdateProfile(user);
    }
  }, [user, loading]);

  const clearAuthState = () => {
    // Clear all auth-related data from localStorage and sessionStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Clear Discord provider tokens
    localStorage.removeItem('discord_provider_token');
    localStorage.removeItem('discord_provider_refresh_token');
    
    setUser(null);
    setSession(null);
    setSubscription(null);
  };

  const checkProfileExists = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking profile:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in checkProfileExists:', error);
      return false;
    }
  };

  const createProfileManually = async (): Promise<boolean> => {
    if (!user) return false;

    console.log('Manually creating profile for user:', user.id);
    const discordData = user.user_metadata;
    
    const profileData = {
      id: user.id,
      discord_id: discordData?.provider_id || discordData?.sub || discordData?.id,
      username: discordData?.global_name || discordData?.username || discordData?.full_name || discordData?.preferred_username || discordData?.name || user.email?.split('@')[0] || 'Discord User',
      avatar_url: discordData?.avatar_url || discordData?.picture,
      email: user.email,
    };

    console.log('Manual profile data:', profileData);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select();

      if (error) {
        console.error('Manual profile creation error:', error);
        return false;
      }

      console.log('Profile created manually:', data);
      return true;
    } catch (error) {
      console.error('Error in createProfileManually:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      // Clear auth state first
      clearAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Force page reload for clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      // Force reload even if signOut fails
      window.location.href = '/';
    }
  };

  const value = {
    user,
    session,
    loading,
    subscription,
    refreshSubscription,
    signOut,
    clearAuthState,
    createProfileManually,
    checkProfileExists,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};