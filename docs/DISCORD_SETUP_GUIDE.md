# Discord Bot Token Setup Guide

## Issue: Member Counts Showing as Zero

The member counts are showing as zero because the Discord bot token (`DISCORD_BOT_TOKEN`) is not configured in your environment variables. This token is required to fetch accurate member counts from Discord servers.

## Solution

### 1. Get Your Discord Bot Token

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application (the one with Client ID: `1391912825534025879`)
3. Navigate to the **Bot** section in the left sidebar
4. Under **Token**, click **Copy** to copy your bot token
5. **IMPORTANT**: Keep this token secure and never share it publicly

### 2. Set the Environment Variable

#### Option A: Using systemctl (Recommended for Production)
```bash
sudo systemctl edit supabase-local
```

Add the following content:
```ini
[Service]
Environment="DISCORD_BOT_TOKEN=your_bot_token_here"
```

Then restart the service:
```bash
sudo systemctl restart supabase-local
```

#### Option B: Using .env file (for development)
Create a `.env` file in your project root:
```bash
echo "DISCORD_BOT_TOKEN=your_bot_token_here" >> .env
```

### 3. Verify the Setup

Run this command to check if the token is properly set:
```bash
# For systemctl setup
sudo systemctl show supabase-local | grep DISCORD_BOT_TOKEN

# For .env setup
cat .env | grep DISCORD_BOT_TOKEN
```

### 4. Restart Supabase Functions

After setting the token, restart your Supabase functions:
```bash
# If using local Supabase
supabase functions serve --restart

# If using hosted Supabase, redeploy functions
supabase functions deploy discord-guilds
```

### 5. Test the Fix

1. Go to your dashboard
2. Click the "Refresh" button
3. The member counts should now display correctly

## Security Notes

- **Never commit the bot token to version control**
- **Use environment variables for production**
- **Rotate the token if it's ever compromised**
- **Only give the bot necessary permissions**

## Troubleshooting

### Still showing zero members?
1. Make sure the bot is actually invited to the Discord servers
2. Check that the bot has the correct permissions (at least `Read Messages` and `View Channels`)
3. Verify the bot token is correct and not expired

### Bot not responding?
1. Check if the bot is online in Discord
2. Verify the bot token is set correctly
3. Check Supabase function logs for errors:
   ```bash
   supabase functions logs discord-guilds
   ```

## Quick Fix Command

You can run this command to set the token immediately:
```bash
# Replace YOUR_ACTUAL_BOT_TOKEN with your real bot token
export DISCORD_BOT_TOKEN="YOUR_ACTUAL_BOT_TOKEN"
```

**Note**: This is temporary and will be lost when you restart your session. Use the systemctl method for permanent setup. 