-- Fix guilds table to work with bot sync
-- Remove NOT NULL constraint from user_id since bot doesn't have access to Supabase user IDs
ALTER TABLE guilds ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies to work without user_id requirement
DROP POLICY IF EXISTS "Users can view their own guilds" ON guilds;
CREATE POLICY "Users can view their own guilds" ON guilds
  FOR SELECT USING (
    user_id = auth.uid() OR 
    owner_id IN (
      SELECT discord_id FROM profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert their own guilds" ON guilds;
CREATE POLICY "Users can insert their own guilds" ON guilds
  FOR INSERT WITH CHECK (
    user_id = auth.uid() OR 
    owner_id IN (
      SELECT discord_id FROM profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update their own guilds" ON guilds;
CREATE POLICY "Users can update their own guilds" ON guilds
  FOR UPDATE USING (
    user_id = auth.uid() OR 
    owner_id IN (
      SELECT discord_id FROM profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete their own guilds" ON guilds;
CREATE POLICY "Users can delete their own guilds" ON guilds
  FOR DELETE USING (
    user_id = auth.uid() OR 
    owner_id IN (
      SELECT discord_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Allow service role to manage all guilds (for bot sync)
DROP POLICY IF EXISTS "Service role can manage all guilds" ON guilds;
CREATE POLICY "Service role can manage all guilds" ON guilds
  FOR ALL TO service_role
  WITH CHECK (true);

-- Create index for better performance on owner_id lookups
CREATE INDEX IF NOT EXISTS idx_guilds_owner_id ON guilds(owner_id); 