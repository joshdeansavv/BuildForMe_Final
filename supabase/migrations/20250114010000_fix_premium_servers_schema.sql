-- Fix premium_servers table schema
-- Add missing columns that the bot expects

-- Add guild_name column if it doesn't exist
ALTER TABLE premium_servers 
ADD COLUMN IF NOT EXISTS guild_name TEXT;

-- Add owner_id column if it doesn't exist
ALTER TABLE premium_servers 
ADD COLUMN IF NOT EXISTS owner_id TEXT;

-- Update existing records with guild names
UPDATE premium_servers 
SET guild_name = g.name 
FROM guilds g 
WHERE premium_servers.guild_id = g.id 
AND premium_servers.guild_name IS NULL;

-- Update existing records with owner IDs
UPDATE premium_servers 
SET owner_id = g.owner_id 
FROM guilds g 
WHERE premium_servers.guild_id = g.id 
AND premium_servers.owner_id IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_premium_servers_guild_name ON premium_servers(guild_name);
CREATE INDEX IF NOT EXISTS idx_premium_servers_owner_id ON premium_servers(owner_id); 