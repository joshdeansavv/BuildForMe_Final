-- Create guilds table for Discord server sync
CREATE TABLE IF NOT EXISTS guilds (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  owner_id TEXT,
  permissions TEXT,
  features TEXT[] DEFAULT '{}',
  member_count INTEGER DEFAULT 0,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invite_logs table for tracking bot invites
CREATE TABLE IF NOT EXISTS invite_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  guild_id TEXT NOT NULL,
  guild_name TEXT NOT NULL,
  invite_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, completed, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create premium_servers table for tracking subscription status per guild
CREATE TABLE IF NOT EXISTS premium_servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'inactive', -- active, inactive, canceled
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guilds_user_id ON guilds(user_id);
CREATE INDEX IF NOT EXISTS idx_guilds_id_user_id ON guilds(id, user_id);
CREATE INDEX IF NOT EXISTS idx_invite_logs_user_id ON invite_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_invite_logs_guild_id ON invite_logs(guild_id);
CREATE INDEX IF NOT EXISTS idx_premium_servers_guild_id ON premium_servers(guild_id);
CREATE INDEX IF NOT EXISTS idx_premium_servers_user_id ON premium_servers(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE guilds ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_servers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for guilds
DROP POLICY IF EXISTS "Users can view their own guilds" ON guilds;
CREATE POLICY "Users can view their own guilds" ON guilds
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own guilds" ON guilds;
CREATE POLICY "Users can insert their own guilds" ON guilds
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own guilds" ON guilds;
CREATE POLICY "Users can update their own guilds" ON guilds
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own guilds" ON guilds;
CREATE POLICY "Users can delete their own guilds" ON guilds
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for invite_logs
DROP POLICY IF EXISTS "Users can view their own invite logs" ON invite_logs;
CREATE POLICY "Users can view their own invite logs" ON invite_logs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own invite logs" ON invite_logs;
CREATE POLICY "Users can insert their own invite logs" ON invite_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own invite logs" ON invite_logs;
CREATE POLICY "Users can update their own invite logs" ON invite_logs
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for premium_servers
DROP POLICY IF EXISTS "Users can view their own premium servers" ON premium_servers;
CREATE POLICY "Users can view their own premium servers" ON premium_servers
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own premium servers" ON premium_servers;
CREATE POLICY "Users can insert their own premium servers" ON premium_servers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own premium servers" ON premium_servers;
CREATE POLICY "Users can update their own premium servers" ON premium_servers
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  SET search_path = public;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_guilds_updated_at ON guilds;
CREATE TRIGGER update_guilds_updated_at
  BEFORE UPDATE ON guilds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invite_logs_updated_at ON invite_logs;
CREATE TRIGGER update_invite_logs_updated_at
  BEFORE UPDATE ON invite_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_premium_servers_updated_at ON premium_servers;
CREATE TRIGGER update_premium_servers_updated_at
  BEFORE UPDATE ON premium_servers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update the get_server_subscription_status function to use the new premium_servers table
CREATE OR REPLACE FUNCTION get_server_subscription_status(server_id_param TEXT)
RETURNS TEXT AS $$
DECLARE
  subscription_status TEXT;
BEGIN
  SET search_path = public;
  -- Check if server has an active subscription in premium_servers table
  SELECT status INTO subscription_status
  FROM premium_servers
  WHERE guild_id = server_id_param
  AND user_id = auth.uid()
  ORDER BY updated_at DESC
  LIMIT 1;

  -- Return default if no result found
  IF subscription_status IS NULL THEN
    subscription_status := 'no_subscription';
  END IF;

  RETURN subscription_status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_server_subscription_status(TEXT) TO authenticated; 