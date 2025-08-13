-- Create activity_logs table for tracking command usage and bot analytics
DROP TABLE IF EXISTS activity_logs;
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  guild_id TEXT NOT NULL,
  command_name TEXT NOT NULL,
  success BOOLEAN DEFAULT true,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_guild_id ON activity_logs(guild_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_command_name ON activity_logs(command_name);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp);

-- Enable RLS (Row Level Security)
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for activity_logs
-- Note: Bot can write to this table using service role key
-- Users can only read their own activity logs
DROP POLICY IF EXISTS "Users can view their own activity logs" ON activity_logs;
CREATE POLICY "Users can view their own activity logs" ON activity_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Allow service role to insert activity logs (for bot tracking)
DROP POLICY IF EXISTS "Service role can insert activity logs" ON activity_logs;
CREATE POLICY "Service role can insert activity logs" ON activity_logs
  FOR INSERT TO service_role
  WITH CHECK (true);

-- Create function to get activity stats for a user
CREATE OR REPLACE FUNCTION get_user_activity_stats(user_id_param UUID)
RETURNS TABLE (
  total_commands INTEGER,
  successful_commands INTEGER,
  failed_commands INTEGER,
  most_used_command TEXT,
  last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  SET search_path = public;
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_commands,
    COUNT(CASE WHEN success = true THEN 1 END)::INTEGER as successful_commands,
    COUNT(CASE WHEN success = false THEN 1 END)::INTEGER as failed_commands,
    (
      SELECT command_name 
      FROM activity_logs 
      WHERE user_id = user_id_param 
      GROUP BY command_name 
      ORDER BY COUNT(*) DESC 
      LIMIT 1
    ) as most_used_command,
    MAX(timestamp) as last_activity
  FROM activity_logs 
  WHERE user_id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_activity_stats(UUID) TO authenticated;

-- Create function to get guild activity stats
CREATE OR REPLACE FUNCTION get_guild_activity_stats(guild_id_param TEXT)
RETURNS TABLE (
  total_commands INTEGER,
  successful_commands INTEGER,
  failed_commands INTEGER,
  most_used_command TEXT,
  most_active_user UUID,
  last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  SET search_path = public;
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_commands,
    COUNT(CASE WHEN success = true THEN 1 END)::INTEGER as successful_commands,
    COUNT(CASE WHEN success = false THEN 1 END)::INTEGER as failed_commands,
    (
      SELECT command_name 
      FROM activity_logs 
      WHERE guild_id = guild_id_param 
      GROUP BY command_name 
      ORDER BY COUNT(*) DESC 
      LIMIT 1
    ) as most_used_command,
    (
      SELECT user_id 
      FROM activity_logs 
      WHERE guild_id = guild_id_param 
      GROUP BY user_id 
      ORDER BY COUNT(*) DESC 
      LIMIT 1
    ) as most_active_user,
    MAX(timestamp) as last_activity
  FROM activity_logs 
  WHERE guild_id = guild_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_guild_activity_stats(TEXT) TO authenticated; 