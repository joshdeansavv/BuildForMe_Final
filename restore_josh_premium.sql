-- Restore free premium access for Josh (jnyco@icloud.com)
-- Run this in your Supabase SQL Editor

-- Insert/Update joshdeanpro with free premium
INSERT INTO subscribers (
  email,
  discord_username,
  subscription_status,
  subscription_start,
  subscription_end,
  subscribed,
  created_at,
  updated_at
) VALUES (
  'jnyco@icloud.com',
  'joshdeanpro',
  'active',
  NOW(),
  NOW() + INTERVAL '10 years',  -- 10 years of premium
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) 
DO UPDATE SET
  discord_username = 'joshdeanpro',
  subscription_status = 'active',
  subscription_start = NOW(),
  subscription_end = NOW() + INTERVAL '10 years',
  subscribed = true,
  updated_at = NOW();

-- Verify the account was created/updated
SELECT 
  email,
  discord_username,
  subscription_status,
  subscription_start,
  subscription_end,
  subscribed
FROM subscribers 
WHERE email = 'jnyco@icloud.com'; 