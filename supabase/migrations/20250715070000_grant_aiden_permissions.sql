-- Grant premium bot permissions to user 'aiden' 
-- Create subscriber record with active premium status (bot checks this table)

INSERT INTO subscribers (
  email,
  user_id,
  discord_user_id,
  discord_username,
  subscription_status,
  subscription_tier,
  subscription_start,
  subscription_end,
  subscribed,
  created_at,
  updated_at
) VALUES (
  'aiden@buildforme.xyz',
  '2db9e8fc-da9b-4ca0-87f4-1098e9f2a2ac',
  'aiden_discord_id',
  'aiden',
  'active',
  'pro',
  NOW(),
  NOW() + INTERVAL '1 year',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  user_id = '2db9e8fc-da9b-4ca0-87f4-1098e9f2a2ac',
  discord_user_id = 'aiden_discord_id',
  discord_username = 'aiden',
  subscription_status = 'active',
  subscription_tier = 'pro',
  subscription_start = NOW(),
  subscription_end = NOW() + INTERVAL '1 year',
  subscribed = true,
  updated_at = NOW();

-- Show the created record
SELECT 
  email,
  discord_username,
  subscription_status,
  subscription_tier,
  subscribed,
  subscription_start,
  subscription_end
FROM subscribers 
WHERE email = 'aiden@buildforme.xyz'; 