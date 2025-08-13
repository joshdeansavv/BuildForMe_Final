-- =============================================================================
-- COMPREHENSIVE DEBUG AND FIX SCRIPT
-- Run this in your Supabase SQL Editor to debug and fix both issues
-- =============================================================================

-- 1. DEBUG: Check what user data exists in auth.users and profiles
SELECT 
  'AUTH.USERS' as table_name,
  au.id as user_id,
  au.email,
  au.raw_user_meta_data->>'user_name' as discord_username,
  au.raw_user_meta_data->>'provider_id' as discord_id,
  au.raw_user_meta_data->>'global_name' as global_name,
  au.created_at
FROM auth.users au
WHERE au.email ILIKE '%josh%' OR au.email ILIKE '%aiden%' OR 
      au.raw_user_meta_data->>'user_name' ILIKE '%josh%' OR 
      au.raw_user_meta_data->>'user_name' ILIKE '%aiden%'
ORDER BY au.created_at DESC;

-- Check profiles table
SELECT 
  'PROFILES' as table_name,
  p.id,
  p.discord_id,
  p.username,
  p.email,
  p.created_at
FROM profiles p
WHERE p.email ILIKE '%josh%' OR p.email ILIKE '%aiden%' OR 
      p.username ILIKE '%josh%' OR p.username ILIKE '%aiden%'
ORDER BY p.created_at DESC;

-- Check subscribers table  
SELECT 
  'SUBSCRIBERS' as table_name,
  s.id,
  s.email,
  s.discord_username,
  s.discord_user_id,
  s.subscription_status,
  s.subscription_tier,
  s.subscribed,
  s.created_at
FROM subscribers s
WHERE s.email ILIKE '%josh%' OR s.email ILIKE '%aiden%' OR 
      s.discord_username ILIKE '%josh%' OR s.discord_username ILIKE '%aiden%'
ORDER BY s.created_at DESC;

-- =============================================================================
-- 2. FIX DEV ACCOUNTS: Insert/Update based on actual user data
-- =============================================================================

-- First, let's find Josh's actual user data and create/update subscriber record
DO $$ 
DECLARE 
    josh_user_id UUID;
    josh_email TEXT;
    josh_discord_username TEXT;
    josh_discord_id TEXT;
    aiden_user_id UUID;
    aiden_email TEXT;  
    aiden_discord_username TEXT;
    aiden_discord_id TEXT;
BEGIN
    -- Find Josh's actual data
    SELECT au.id, au.email, au.raw_user_meta_data->>'user_name', au.raw_user_meta_data->>'provider_id'
    INTO josh_user_id, josh_email, josh_discord_username, josh_discord_id
    FROM auth.users au
    WHERE au.email ILIKE '%josh%' OR au.raw_user_meta_data->>'user_name' ILIKE '%josh%'
    ORDER BY au.created_at DESC LIMIT 1;
    
    -- Find Aiden's actual data  
    SELECT au.id, au.email, au.raw_user_meta_data->>'user_name', au.raw_user_meta_data->>'provider_id'
    INTO aiden_user_id, aiden_email, aiden_discord_username, aiden_discord_id
    FROM auth.users au
    WHERE au.email ILIKE '%aiden%' OR au.raw_user_meta_data->>'user_name' ILIKE '%aiden%'
    ORDER BY au.created_at DESC LIMIT 1;
    
    -- Create/Update Josh's subscriber record if user found
    IF josh_user_id IS NOT NULL THEN
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
            COALESCE(josh_email, 'josh@buildforme.dev'),
            josh_user_id::TEXT,
            COALESCE(josh_discord_id, 'josh_discord_id'),
            'joshdeanpro',  -- Use the exact username the Edge Functions look for
            'active',
            'pro',
            NOW(),
            NOW() + INTERVAL '10 years',
            true,
            NOW(),
            NOW()
        )
        ON CONFLICT (email) DO UPDATE SET
            user_id = josh_user_id::TEXT,
            discord_user_id = COALESCE(josh_discord_id, 'josh_discord_id'),
            discord_username = 'joshdeanpro',
            subscription_status = 'active',
            subscription_tier = 'pro',
            subscription_start = NOW(),
            subscription_end = NOW() + INTERVAL '10 years',
            subscribed = true,
            updated_at = NOW();
            
        RAISE NOTICE 'Josh dev account created/updated: email=%, user_id=%, discord_username=%', 
            COALESCE(josh_email, 'josh@buildforme.dev'), josh_user_id, 'joshdeanpro';
    ELSE
        RAISE NOTICE 'Josh user not found in auth.users - you need to log in first';
    END IF;
    
    -- Create/Update Aiden's subscriber record if user found
    IF aiden_user_id IS NOT NULL THEN
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
            COALESCE(aiden_email, 'aiden@buildforme.dev'),
            aiden_user_id::TEXT,
            COALESCE(aiden_discord_id, 'aiden_discord_id'),
            'aidenbgegos',  -- Use the exact username the Edge Functions look for
            'active',
            'pro',
            NOW(),
            NOW() + INTERVAL '10 years',
            true,
            NOW(),
            NOW()
        )
        ON CONFLICT (email) DO UPDATE SET
            user_id = aiden_user_id::TEXT,
            discord_user_id = COALESCE(aiden_discord_id, 'aiden_discord_id'),
            discord_username = 'aidenbgegos',
            subscription_status = 'active',
            subscription_tier = 'pro',
            subscription_start = NOW(),
            subscription_end = NOW() + INTERVAL '10 years',
            subscribed = true,
            updated_at = NOW();
            
        RAISE NOTICE 'Aiden dev account created/updated: email=%, user_id=%, discord_username=%', 
            COALESCE(aiden_email, 'aiden@buildforme.dev'), aiden_user_id, 'aidenbgegos';
    ELSE
        RAISE NOTICE 'Aiden user not found in auth.users - needs to log in first';
    END IF;
END $$;

-- =============================================================================
-- 3. DEBUG SERVER TRACKING: Check what's in the tables
-- =============================================================================

-- Check guilds table (new structure)
SELECT 
  'GUILDS TABLE' as source,
  COUNT(*) as total_guilds,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT owner_id) as unique_owners
FROM guilds;

-- Check specific guild data
SELECT 
  'GUILD DETAILS' as source,
  g.id as guild_id,
  g.name as guild_name,
  g.owner_id as discord_owner_id,
  g.user_id as supabase_user_id,
  g.member_count,
  g.created_at
FROM guilds g
ORDER BY g.created_at DESC
LIMIT 10;

-- Check invite logs
SELECT 
  'INVITE LOGS' as source,
  COUNT(*) as total_invites,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT guild_id) as unique_guilds
FROM invite_logs;

-- Check recent invite logs
SELECT 
  'RECENT INVITES' as source,
  il.guild_name,
  il.status,
  il.created_at,
  au.email as user_email
FROM invite_logs il
LEFT JOIN auth.users au ON il.user_id = au.id
ORDER BY il.created_at DESC
LIMIT 10;

-- Check premium servers
SELECT 
  'PREMIUM SERVERS' as source,
  ps.guild_id,
  ps.status,
  ps.created_at,
  au.email as user_email
FROM premium_servers ps
LEFT JOIN auth.users au ON ps.user_id = au.id
ORDER BY ps.created_at DESC
LIMIT 10;

-- =============================================================================
-- 4. VERIFY DEV ACCOUNTS AFTER SETUP
-- =============================================================================

SELECT 
  '=== DEV ACCOUNTS VERIFICATION ===' as section,
  s.email,
  s.discord_username,
  s.subscription_status,
  s.subscription_tier,
  s.subscribed,
  s.subscription_start,
  s.subscription_end
FROM subscribers s 
WHERE s.discord_username IN ('joshdeanpro', 'aidenbgegos')
ORDER BY s.discord_username;

-- =============================================================================
-- 5. MANUAL FIX IF AUTOMATIC DOESN'T WORK
-- =============================================================================

-- If the automatic script above doesn't work, uncomment and modify these:

/*
-- MANUAL FIX FOR JOSH (uncomment and update with real values)
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
  'josh@YOURDOMAIN.com',  -- REPLACE WITH JOSH'S ACTUAL EMAIL
  'JOSH_USER_UUID_HERE',  -- REPLACE WITH JOSH'S ACTUAL UUID FROM AUTH.USERS
  'JOSH_DISCORD_ID_HERE', -- REPLACE WITH JOSH'S DISCORD ID
  'joshdeanpro',
  'active',
  'pro', 
  NOW(),
  NOW() + INTERVAL '10 years',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  discord_username = 'joshdeanpro',
  subscription_status = 'active',
  subscription_tier = 'pro',
  subscribed = true,
  updated_at = NOW();

-- MANUAL FIX FOR AIDEN (uncomment and update with real values)  
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
  'aiden@YOURDOMAIN.com',  -- REPLACE WITH AIDEN'S ACTUAL EMAIL
  'AIDEN_USER_UUID_HERE',  -- REPLACE WITH AIDEN'S ACTUAL UUID FROM AUTH.USERS
  'AIDEN_DISCORD_ID_HERE', -- REPLACE WITH AIDEN'S DISCORD ID
  'aidenbgegos',
  'active',
  'pro',
  NOW(),
  NOW() + INTERVAL '10 years',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  discord_username = 'aidenbgegos',
  subscription_status = 'active',
  subscription_tier = 'pro',
  subscribed = true,
  updated_at = NOW();
*/ 