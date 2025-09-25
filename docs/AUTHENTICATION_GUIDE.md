# Authentication & User-Specific Data Guide

## Overview

Your BuildForMe Discord Bot Dashboard implements comprehensive user-based authentication and data filtering. All data is dynamically filtered based on the authenticated user's identity and permissions.

## Authentication Flow

### 1. Discord OAuth Integration
- **Location**: `src/contexts/AuthContext.tsx`
- **Process**: Users authenticate via Discord OAuth
- **Session Management**: Supabase handles session persistence
- **User Data**: Discord profile information is automatically synced to the database

### 2. User Profile Creation
- **Automatic**: Profile created on first login
- **Manual Fallback**: `ProfileChecker.tsx` handles edge cases
- **Data Stored**: Discord ID, username, avatar, email

## Data Filtering Mechanisms

### Frontend Authentication Context

```typescript
// src/contexts/AuthContext.tsx
export const useAuth = () => {
  // Returns current user and session
  // All components use this for user-specific operations
}
```

**Key Features:**
- Real-time session monitoring
- Automatic profile creation/updates
- Subscription status checking
- User-specific data filtering

### Edge Functions (Server-Side)

All Supabase Edge Functions authenticate users and filter data:

#### Discord Guilds Function
```typescript
// supabase/functions/discord-guilds/index.ts
const { data: { user }, error } = await supabaseClient.auth.getUser(
  authHeader.replace('Bearer ', '')
)
// Only returns guilds the authenticated user can manage
```

#### Bot Invite Function
```typescript
// supabase/functions/discord-bot-invite/index.ts
// Validates user authentication before generating invite URLs
// Only allows invites for servers the user owns/manages
```

### Database-Level Security

#### Row Level Security (RLS)
All tables have RLS policies that filter data by user:

```sql
-- Example: Servers table
CREATE POLICY "Users can view servers they own" ON servers
  FOR SELECT USING (owner_id = auth.uid());

-- Example: User subscriptions
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
  FOR SELECT USING (user_id = auth.uid());
```

#### Database Functions
```sql
-- get_server_subscription_status function
-- Only returns subscription status for servers the user owns
CREATE OR REPLACE FUNCTION get_server_subscription_status(server_id_param TEXT)
RETURNS TEXT AS $$
-- Function filters by user ownership
$$
```

## Component-Level Authentication

### Dashboard Component
```typescript
// src/pages/Dashboard.tsx
const { user, session } = useAuth();

if (!user) {
  return <AuthenticationRequired />;
}
// Only renders if user is authenticated
```

### GuildManager Component
```typescript
// src/components/GuildManager.tsx
const fetchGuilds = async () => {
  if (!session || !user) return;
  
  // Fetches only user's manageable guilds
  const response = await supabase.functions.invoke('discord-guilds', {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });
}
```

## User-Specific Data Examples

### 1. Discord Servers
- **Source**: Discord API via user's OAuth token
- **Filter**: Only servers where user has `MANAGE_GUILD` permission or is owner
- **Function**: `discord-guilds` Edge Function

### 2. Subscription Status
- **Source**: Stripe + Supabase database
- **Filter**: Only subscriptions belonging to the authenticated user
- **Function**: `get_server_subscription_status` database function

### 3. Bot Management
- **Source**: Database + Discord API
- **Filter**: Only bots on servers the user owns/manages
- **Security**: RLS policies ensure data isolation

## Security Features

### 1. Token-Based Authentication
- JWT tokens for session management
- Automatic token refresh
- Secure token storage

### 2. Permission Validation
- Discord permission checking
- Server ownership verification
- Role-based access control

### 3. Data Isolation
- User-specific database queries
- RLS policies on all tables
- Edge Function authentication

### 4. CORS Protection
- Proper CORS headers
- Origin validation
- Request authentication

## Testing Authentication

### 1. Login Flow
```bash
# Visit your application
# Click "Login with Discord"
# Verify profile creation
# Check dashboard data
```

### 2. Data Verification
```typescript
// Check that data is user-specific
console.log('Current user:', user.id);
console.log('User guilds:', guilds); // Only user's manageable guilds
console.log('Subscription:', subscription); // Only user's subscription
```

### 3. Permission Testing
- Try accessing another user's data (should fail)
- Check RLS policies in Supabase dashboard
- Verify Edge Function logs

## Common Issues & Solutions

### Issue: No guilds showing
**Solution**: Check Discord OAuth scopes include `guilds`

### Issue: Subscription status not loading
**Solution**: Verify RLS policies and database function permissions

### Issue: Bot invite failing
**Solution**: Check bot client ID in Edge Function

### Issue: Authentication loops
**Solution**: Clear browser storage and retry login

## Environment Variables Required

```bash
# Frontend (.env)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Edge Functions (Supabase)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Monitoring & Debugging

### 1. Supabase Dashboard
- Check user authentication logs
- Monitor Edge Function executions
- Verify RLS policy effectiveness

### 2. Browser DevTools
- Check network requests for authentication headers
- Verify localStorage for session data
- Monitor console for authentication errors

### 3. Database Queries
```sql
-- Check user profiles
SELECT * FROM profiles WHERE id = auth.uid();

-- Check user servers
SELECT * FROM servers WHERE owner_id = auth.uid();

-- Check subscriptions
SELECT * FROM user_subscriptions WHERE user_id = auth.uid();
```

## Summary

Your authentication system ensures that:

1. **All data is user-specific** - No user can see another user's data
2. **Real-time filtering** - Data updates based on current user session
3. **Multiple security layers** - Frontend, Edge Functions, and database all validate user identity
4. **Discord integration** - Seamless OAuth flow with Discord permissions
5. **Subscription management** - User-specific billing and subscription tracking

The system is designed to be secure, scalable, and user-friendly while maintaining strict data isolation between users. 