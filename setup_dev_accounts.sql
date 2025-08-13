-- Setup free premium access for developer accounts
-- Run this in your Supabase SQL editor

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
  'jnyco@icloud.com',  -- Josh's actual email
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

-- Insert/Update aidenbgegos with free premium  
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
  'aiden@example.com',  -- Replace with Aiden's actual email
  'aidenbgegos',
  'active',
  NOW(),
  NOW() + INTERVAL '10 years',  -- 10 years of premium
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email)
DO UPDATE SET
  discord_username = 'aidenbgegos',
  subscription_status = 'active',
  subscription_start = NOW(),
  subscription_end = NOW() + INTERVAL '10 years',
  subscribed = true,
  updated_at = NOW();

-- Verify the accounts were created
SELECT 
  email,
  discord_username,
  subscription_status,
  subscription_start,
  subscription_end,
  subscribed
FROM subscribers 
WHERE discord_username IN ('joshdeanpro', 'aidenbgegos'); 