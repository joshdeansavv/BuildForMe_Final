"""
🚀 Professional AI Discord Server Builder
A comprehensive Discord bot for server management with AI-powered features.

Requirements:
- python-dotenv>=1.0.0
- discord.py>=2.3.2
- openai>=1.3.0
- supabase>=2.0.0
"""

import os
import logging
import json
import asyncio
import io
import datetime
import sys
import time
import signal
from typing import Optional, List, Dict, Any, Union, cast
from typing_extensions import Literal

import discord
from discord.ext import commands
from discord import app_commands, Interaction

try:
    from dotenv import load_dotenv
    from openai import OpenAI
    from supabase import create_client, Client
except ImportError as e:
    print(f"❌ Missing required dependency: {e}")
    print("Please install dependencies with: pip install -r requirements.txt")
    sys.exit(1)

# Load environment variables
load_dotenv()

# Configure logging with better format and level
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('bot.log', encoding='utf-8')
    ]
)

# Reduce noise from external libraries
logging.getLogger('discord.http').setLevel(logging.WARNING)
logging.getLogger('httpx').setLevel(logging.WARNING)
logging.getLogger('urllib3').setLevel(logging.WARNING)

# Bot configuration
DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Validate critical environment variables
if not DISCORD_TOKEN:
    print("❌ DISCORD_TOKEN is required to run the bot")
    print("Please set your Discord bot token in the .env file")
    print("Get your token from: https://discord.com/developers/applications")
    sys.exit(1)

# Warn about missing optional variables
optional_vars = {
    "OPENAI_API_KEY": OPENAI_API_KEY,
    "SUPABASE_URL": SUPABASE_URL,
    "SUPABASE_SERVICE_ROLE_KEY": SUPABASE_SERVICE_ROLE_KEY
}

missing_optional = [var for var, value in optional_vars.items() if not value]
if missing_optional:
    print(f"⚠️  Missing optional environment variables: {', '.join(missing_optional)}")
    print("Some features may be limited without these variables")
    print("Set them in your .env file for full functionality")

# Global variables for graceful shutdown
bot_instance = None
shutdown_requested = False

def signal_handler(signum, frame):
    """Handle shutdown signals gracefully"""
    global shutdown_requested
    logging.info(f"Received signal {signum}, initiating graceful shutdown...")
    shutdown_requested = True
    if bot_instance:
        asyncio.create_task(bot_instance.close())

# Register signal handlers
signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

# Initialize Supabase client with retry logic
def create_supabase_client() -> Optional[Client]:
    """Create Supabase client with error handling"""
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        logging.warning("⚠️ Supabase credentials not provided")
        return None
        
    max_retries = 3
    for attempt in range(max_retries):
        try:
            client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
            # Test connection
            client.table("profiles").select("id").limit(1).execute()
            logging.info("✅ Supabase connection established")
            return client
        except Exception as e:
            logging.warning(f"Supabase connection attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
            else:
                logging.error("❌ Failed to connect to Supabase after all retries")
                return None

supabase: Optional[Client] = create_supabase_client()

# Database sync functions
async def sync_guild_to_database(guild: discord.Guild, action: str = "join"):
    """Sync guild information to the database"""
    if not supabase:
        logging.error("❌ No Supabase connection available for guild sync")
        return
    
    try:
        guild_data = {
            "id": str(guild.id),
            "name": guild.name,
            "icon": guild.icon.url if guild.icon else None,
            "owner_id": str(guild.owner_id),
            "member_count": guild.member_count,
            "features": guild.features,
            "permissions": "0",  # Default permissions
        }
        
        if action == "join":
            # Upsert guild to database
            result = supabase.table("guilds").upsert(guild_data, on_conflict="id").execute()
            logging.info(f"✅ Guild {guild.name} synced to database")
            
            # Try to get the actual user who invited the bot from the guild owner
            # In most cases, this will be the guild owner, but we should handle edge cases
            inviter_id = str(guild.owner_id)
            
            # Log the successful bot invitation
            invite_data = {
                "user_id": inviter_id,
                "guild_id": str(guild.id),
                "guild_name": guild.name,
                "status": "completed",
                "invite_url": f"Bot successfully joined guild {guild.name}",
            }
            
            try:
                invite_result = supabase.table("invite_logs").insert(invite_data).execute()
                logging.info(f"✅ Bot invite logged successfully for guild {guild.name}")
            except Exception as invite_error:
                logging.error(f"❌ Failed to log bot invite for guild {guild.name}: {invite_error}")
            
            # Update the guild owner's subscriber record if it exists
            try:
                # Check if the guild owner has a subscriber record
                subscriber_check = supabase.table("subscribers").select("id, discord_user_id").eq("discord_user_id", str(guild.owner_id)).execute()
                
                if subscriber_check.data:
                    logging.info(f"📋 Found subscriber record for guild owner {guild.owner_id}")
                else:
                    logging.info(f"📋 No subscriber record found for guild owner {guild.owner_id}")
                    
            except Exception as subscriber_error:
                logging.error(f"❌ Error checking subscriber record: {subscriber_error}")
            
        elif action == "leave":
            # Log the removal but don't delete guild data for analytics
            logging.info(f"📤 Bot left guild: {guild.name}")
            
            # Log the bot removal
            leave_data = {
                "user_id": str(guild.owner_id),
                "guild_id": str(guild.id),
                "guild_name": guild.name,
                "status": "removed",
                "invite_url": f"Bot left guild {guild.name}",
            }
            
            try:
                supabase.table("invite_logs").insert(leave_data).execute()
                logging.info(f"✅ Bot removal logged for guild {guild.name}")
            except Exception as leave_error:
                logging.error(f"❌ Failed to log bot removal for guild {guild.name}: {leave_error}")
            
            # Update any premium servers to inactive
            try:
                supabase.table("premium_servers").update({"status": "inactive"}).eq("guild_id", str(guild.id)).execute()
                logging.info(f"✅ Premium server status updated to inactive for guild {guild.name}")
            except Exception as premium_error:
                logging.error(f"❌ Failed to update premium server status: {premium_error}")
            
    except Exception as e:
        logging.error(f"❌ Error syncing guild {guild.name} to database: {e}")
        logging.error(f"❌ Full error details: {type(e).__name__}: {str(e)}")

async def track_command_usage(user_id: str, guild_id: str, command_name: str, success: bool = True):
    """Track command usage for analytics"""
    if not supabase:
        logging.warning("⚠️ No Supabase connection available for analytics tracking")
        return
    
    try:
        activity_data = {
            "user_id": user_id,
            "guild_id": guild_id,
            "command_name": command_name,
            "success": success,
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "metadata": {}  # Add any additional metadata here
        }
        
        # Insert activity log
        result = supabase.table("activity_logs").insert(activity_data).execute()
        logging.info(f"📊 Command usage tracked: {command_name} in {guild_id} by {user_id} (success: {success})")
        
    except Exception as e:
        logging.error(f"❌ Error tracking command usage: {e}")
        logging.error(f"❌ Full error details: {type(e).__name__}: {str(e)}")

def is_paying_user(server_id: int) -> bool:
    """Check if a server has an active subscription by checking the subscribers table
    
    IMPORTANT: This function ONLY READS from the database - no writes/updates
    Uses service role key to bypass RLS safely for billing checks
    """
    if not supabase:
        logging.error("❌ No Supabase connection available")
        return False
    
    try:
        # Convert Discord ID to string for database lookup
        server_id_str = str(server_id)
        
        logging.info(f"🔍 Checking subscription for server {server_id_str}")
        
        # First, try to find the server owner in the guilds table
        guild_result = supabase.table("guilds").select("owner_id, user_id").eq("id", server_id_str).execute()
        
        if not guild_result.data:
            logging.info(f"📋 Server {server_id} not found in guilds table")
            return False
        
        guild_data = guild_result.data[0]
        owner_discord_id = guild_data.get("owner_id")
        
        if not owner_discord_id:
            logging.info(f"📋 No owner found for server {server_id}")
            return False
        
        # Check if the server owner has an active subscription
        subscriber_result = supabase.table("subscribers").select("subscription_status, discord_user_id").eq("discord_user_id", owner_discord_id).execute()
        
        if not subscriber_result.data:
            logging.info(f"📋 No subscription found for server owner {owner_discord_id}")
            return False
        
        subscriber_data = subscriber_result.data[0]
        subscription_status = subscriber_data.get("subscription_status", "pending")
        
        logging.info(f"📋 Subscription status: '{subscription_status}' for server {server_id} (owner: {owner_discord_id})")
        
        is_active = subscription_status == 'active'
        
        if is_active:
            logging.info(f"✅ Server {server_id} has active subscription")
        else:
            logging.info(f"❌ Server {server_id} does not have active subscription (status: {subscription_status})")
        
        return is_active
        
    except Exception as e:
        logging.error(f"❌ Database error checking subscription for server {server_id}: {e}")
        # Fail safely - assume no subscription if we can't check
        return False

def track_command(func):
    """Decorator to automatically track command usage"""
    async def wrapper(self, interaction: discord.Interaction, *args, **kwargs):
        command_name = func.__name__
        user_id = str(interaction.user.id)
        guild_id = str(interaction.guild.id) if interaction.guild else "DM"
        
        try:
            # Execute the command
            result = await func(self, interaction, *args, **kwargs)
            
            # Track successful command usage (only for guild commands)
            if interaction.guild:
                await track_command_usage(user_id, guild_id, command_name, success=True)
            
            return result
        except Exception as e:
            # Track failed command usage (only for guild commands)
            if interaction.guild:
                await track_command_usage(user_id, guild_id, command_name, success=False)
            raise e
    
    return wrapper

def ai_subscription_required():
    """Decorator for AI features - requires active subscription (with limited admin bypass)"""
    def predicate(interaction: discord.Interaction) -> bool:
        if not interaction.guild:
            raise app_commands.AppCommandError("❌ This command can only be used in servers.")
        
        # Check subscription status - NO BYPASSES for proper security
        server_id = interaction.guild.id
        if not is_paying_user(server_id):
            raise app_commands.AppCommandError(
                "🤖 **AI Features Require Subscription**\n\n"
                "This command uses AI features and requires an active subscription.\n\n"
                "💳 **Visit our dashboard to upgrade:**\n"
                "• https://buildforme.xyz/dashboard\n"
                "• Use basic commands (no subscription needed)\n"
                "• Contact support for help\n\n"
                "📧 Need assistance? Visit https://buildforme.xyz for support."
            )
        
        return True
    return app_commands.check(predicate)

class AIService:
    """AI service with improved error handling and rate limiting"""
    
    def __init__(self, api_key: Optional[str]):
        self.client = OpenAI(api_key=api_key) if api_key else None
        self.logger = logging.getLogger("AIService")
        self.last_request_time = 0
        self.min_request_interval = 1.0  # Minimum seconds between requests

    async def generate_response(self, system_prompt: str, user_prompt: str, max_retries: int = 3) -> Optional[str]:
        """Generate AI response with rate limiting and retries"""
        
        if not self.client:
            self.logger.error("❌ OpenAI client not initialized")
            return None
        
        # Rate limiting
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        if time_since_last < self.min_request_interval:
            await asyncio.sleep(self.min_request_interval - time_since_last)
        
        self.last_request_time = time.time()
        
        for attempt in range(max_retries):
            try:
                self.logger.info(f"AI request attempt {attempt + 1}/{max_retries}")
                
                response = await asyncio.to_thread(
                    self.client.chat.completions.create,
                    model="gpt-4o-mini",  # Use a reliable model
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.7,
                    max_tokens=2000,
                    timeout=30.0  # 30 second timeout
                )
                
                content = response.choices[0].message.content
                if content:
                    self.logger.info("✅ AI response received")
                    return content
                else:
                    self.logger.warning("⚠️ Empty AI response")
                    
            except asyncio.TimeoutError:
                self.logger.warning(f"AI request timeout on attempt {attempt + 1}")
            except Exception as e:
                self.logger.error(f"AI request failed on attempt {attempt + 1}: {e}")
                
            if attempt < max_retries - 1:
                await asyncio.sleep(2 ** attempt)  # Exponential backoff
        
        self.logger.error("❌ All AI request attempts failed")
        return None

class CoreHelper:
    ADMIN_CHANNEL_NAME = "command-hub"
    
    # Protected channel keywords that should NEVER be modified
    PROTECTED_KEYWORDS = [
        "command", "hub", "admin", "mod", "staff", "log", "audit", 
        "announcement", "welcome", "rules", "general", "important"
    ]

    @staticmethod
    async def get_admin_channel(guild: discord.Guild) -> Optional[discord.TextChannel]:
        """Get the admin channel if it exists"""
        try:
            for channel in guild.text_channels:
                if channel.name == CoreHelper.ADMIN_CHANNEL_NAME:
                    return channel
        except Exception as e:
            logging.error(f"Error getting admin channel: {e}")
        return None

    @staticmethod
    async def ensure_admin_channel(guild: discord.Guild) -> Optional[discord.TextChannel]:
        """Ensure admin channel exists, create if needed"""
        existing_channel = await CoreHelper.get_admin_channel(guild)
        if existing_channel:
            return existing_channel

        try:
            # Create channel with proper permissions
            overwrites = {
                guild.default_role: discord.PermissionOverwrite(read_messages=False),
                guild.me: discord.PermissionOverwrite(
                    read_messages=True, 
                    send_messages=True,
                    manage_messages=True
                )
            }
            
            # Add owner permissions
            if guild.owner:
                overwrites[guild.owner] = discord.PermissionOverwrite(
                    read_messages=True, 
                    send_messages=True
                )
            
            # Add admin role permissions
            for role in guild.roles:
                if role.permissions.administrator and not role.is_bot_managed():
                    overwrites[role] = discord.PermissionOverwrite(
                        read_messages=True, 
                        send_messages=True
                    )

            admin_channel = await guild.create_text_channel(
                CoreHelper.ADMIN_CHANNEL_NAME,
                overwrites=overwrites,
                topic="🛡️ Protected admin command channel - BuildForMe Bot",
                reason="Creating protected admin channel"
            )
            
            await admin_channel.send(
                "🛡️ **Command Hub Active**\n"
                "This channel is protected from all bot operations.\n"
                "Use this channel for admin commands safely."
            )
            
            logging.info(f"✅ Created admin channel in {guild.name}")
            return admin_channel
            
        except discord.Forbidden:
            logging.error(f"❌ No permission to create admin channel in {guild.name}")
        except Exception as e:
            logging.error(f"❌ Error creating admin channel in {guild.name}: {e}")
        
        return None

    @staticmethod
    async def ensure_bot_permissions(guild: discord.Guild) -> bool:
        """Ensure bot has proper permissions with better error handling"""
        try:
            bot_member = guild.me
            
            # Check if bot already has sufficient permissions
            required_perms = discord.Permissions(
                manage_channels=True,
                manage_roles=True,
                send_messages=True,
                embed_links=True,
                attach_files=True,
                read_message_history=True,
                manage_messages=True
            )
            
            if bot_member.guild_permissions >= required_perms:
                logging.info(f"✅ Bot has sufficient permissions in {guild.name}")
                return True
            
            logging.warning(f"⚠️ Bot lacks some permissions in {guild.name}")
            return False
            
        except Exception as e:
            logging.error(f"❌ Error checking bot permissions in {guild.name}: {e}")
            return False

    @staticmethod
    def is_protected_channel(channel_name: str) -> bool:
        """Check if a channel name contains protected keywords"""
        if not channel_name:
            return False
        name_lower = channel_name.lower()
        return any(keyword in name_lower for keyword in CoreHelper.PROTECTED_KEYWORDS)

    @staticmethod
    def get_color_palette(theme: str) -> List[int]:
        """Get color palette for themes"""
        palettes = {
            "pastels": [0xFFB3BA, 0xFFDFBA, 0xFFFFBA, 0xBAFFC9, 0xBAE1FF],
            "neon": [0xFF073A, 0xFF9500, 0xFFFF00, 0x00FF00, 0x00FFFF],
            "earthy": [0x8B4513, 0xA0522D, 0xCD853F, 0xD2691E, 0xF4A460],
            "gamer": [0x7289DA, 0x99AAB5, 0x2C2F33, 0x23272A, 0x1E2124],
            "bright": [0xFF0000, 0xFF8000, 0xFFFF00, 0x80FF00, 0x00FF00],
            "standout": [0xFF1493, 0x00CED1, 0xFF4500, 0x9370DB, 0x32CD32]
        }
        return palettes.get(theme.lower(), palettes["gamer"])

def is_admin():
    """Check if user has admin permissions"""
    def predicate(interaction: discord.Interaction) -> bool:
        if not interaction.guild:
            raise app_commands.AppCommandError("❌ This command can only be used in servers.")
        
        member = interaction.guild.get_member(interaction.user.id)
        if not member:
            raise app_commands.AppCommandError("❌ Could not verify your membership.")
        
        if member.guild_permissions.administrator or interaction.guild.owner_id == interaction.user.id:
            return True
        
        raise app_commands.AppCommandError("❌ You need administrator permissions to use this command.")
    
    return app_commands.check(predicate)

class CleanupView(discord.ui.View):
    def __init__(self, cog, user: Union[discord.User, discord.Member], cleanup_plan: Dict[str, Any]):
        super().__init__(timeout=300)
        self.cog = cog
        self.user = user
        self.cleanup_plan = cleanup_plan

    async def interaction_check(self, interaction: discord.Interaction) -> bool:
        return interaction.user == self.user

    @discord.ui.button(label="Start Cleanup", style=discord.ButtonStyle.success, emoji="✅")
    async def start_cleanup(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.defer()
        await self.cog._process_cleanup_with_buttons(interaction, self.cleanup_plan)

    @discord.ui.button(label="Detailed Report", style=discord.ButtonStyle.primary, emoji="📋")
    async def detailed_report(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.defer()
        await self.cog._show_detailed_report_button(interaction, self.cleanup_plan)

    @discord.ui.button(label="Cancel", style=discord.ButtonStyle.danger, emoji="❌")
    async def cancel_cleanup(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.edit_message(content="❌ Cleanup cancelled", embed=None, view=None)

    async def on_timeout(self):
        try:
            for item in self.children:
                item.disabled = True  # type: ignore
        except Exception:
            pass

class IssueFixView(discord.ui.View):
    def __init__(self, cog, user: Union[discord.User, discord.Member], issue: Dict[str, Any], issue_num: int, total_issues: int):
        super().__init__(timeout=120)
        self.cog = cog
        self.user = user
        self.issue = issue
        self.issue_num = issue_num
        self.total_issues = total_issues
        self.result = None
        self.result_event = asyncio.Event()

    async def interaction_check(self, interaction: discord.Interaction) -> bool:
        return interaction.user == self.user

    @discord.ui.button(label="Apply Fix", style=discord.ButtonStyle.success, emoji="✅")
    async def apply_fix(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.defer()
        
        # Try to apply the fix immediately to give better feedback
        assert interaction.guild is not None
        success, message = await self.cog._apply_fix_safely(interaction.guild, self.issue)
        
        if success:
            await interaction.edit_original_response(
                content=f"✅ {message}",
                embed=None,
                view=None
            )
            # Auto-dismiss after 3 seconds
            await asyncio.sleep(3)
            try:
                await interaction.delete_original_response()
            except:
                pass
        else:
            await interaction.edit_original_response(
                content=f"❌ {message}",
                embed=None,
                view=None
            )
            # Auto-dismiss after 5 seconds
            await asyncio.sleep(5)
            try:
                await interaction.delete_original_response()
            except:
                pass
        
        self.result = "apply" if success else "skip"
        self.result_event.set()

    @discord.ui.button(label="Skip", style=discord.ButtonStyle.secondary, emoji="⏭️")
    async def skip_fix(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.edit_message(content="⏭️ Skipped", embed=None, view=None)
        self.result = "skip"
        self.result_event.set()

    @discord.ui.button(label="Stop Cleanup", style=discord.ButtonStyle.danger, emoji="🛑")
    async def stop_cleanup(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.edit_message(content="🛑 Cleanup stopped", embed=None, view=None)
        self.result = "stop"
        self.result_event.set()

    async def wait_for_result(self) -> str:
        await self.result_event.wait()
        return self.result or "skip"

    async def on_timeout(self):
        self.result = "skip"
        self.result_event.set()

class ProfessionalBuilderBot(commands.Bot):
    """Main bot class with improved error handling and connection management"""
    
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        intents.guilds = True
        intents.members = True
        
        super().__init__(
            command_prefix='!',
            intents=intents,
            help_command=None,
            case_insensitive=True
        )
        
        self.ai_service = AIService(OPENAI_API_KEY) if OPENAI_API_KEY else None
        self.startup_time = None

    async def setup_hook(self):
        """Setup hook for bot initialization"""
        try:
            await self.add_cog(MainCog(self))
            logging.info("✅ Main cog loaded successfully")
        except Exception as e:
            logging.error(f"❌ Failed to load main cog: {e}")

    async def on_ready(self):
        """Called when bot is ready"""
        global bot_instance
        bot_instance = self
        self.startup_time = datetime.datetime.utcnow()
        
        logging.info(f"🤖 Bot logged in as {self.user}")
        logging.info(f"📊 Connected to {len(self.guilds)} guilds")
        logging.info(f"🌐 Bot ID: {self.user.id}")
        
        # Sync all existing guilds to database on startup
        logging.info("🔄 Syncing existing guilds to database...")
        for guild in self.guilds:
            try:
                await sync_guild_to_database(guild, "join")
                logging.info(f"✅ Synced guild: {guild.name}")
            except Exception as e:
                logging.error(f"❌ Failed to sync guild {guild.name}: {e}")
        
        logging.info(f"✅ Finished syncing {len(self.guilds)} guilds to database")
        
        # Set bot status
        try:
            await self.change_presence(
                activity=discord.Activity(
                    type=discord.ActivityType.watching,
                    name="servers • /help for commands"
                )
            )
        except Exception as e:
            logging.warning(f"⚠️ Could not set bot status: {e}")

    async def on_guild_join(self, guild: discord.Guild):
        """Called when bot joins a guild"""
        logging.info(f"🎉 Joined guild: {guild.name} (ID: {guild.id})")
        
        # Sync guild to database
        await sync_guild_to_database(guild, "join")
        
        # Ensure admin channel exists
        try:
            await CoreHelper.ensure_admin_channel(guild)
        except Exception as e:
            logging.error(f"❌ Error creating admin channel in {guild.name}: {e}")

    async def on_guild_remove(self, guild: discord.Guild):
        """Called when bot leaves a guild"""
        logging.info(f"👋 Left guild: {guild.name} (ID: {guild.id})")
        
        # Sync guild removal to database
        await sync_guild_to_database(guild, "leave")

    async def on_app_command_error(self, interaction: discord.Interaction, error: app_commands.AppCommandError):
        """Global error handler for app commands"""
        error_msg = str(error)
        
        # Log the error
        logging.error(f"Command error in {interaction.guild.name if interaction.guild else 'DM'}: {error_msg}")
        
        # Send user-friendly error message
        try:
            if not interaction.response.is_done():
                await interaction.response.send_message(
                    f"❌ **Error:** {error_msg}",
                    ephemeral=True
                )
            else:
                await interaction.followup.send(
                    f"❌ **Error:** {error_msg}",
                    ephemeral=True
                )
        except Exception as e:
            logging.error(f"❌ Could not send error message: {e}")

    async def close(self):
        """Graceful shutdown"""
        logging.info("🔄 Initiating bot shutdown...")
        try:
            await super().close()
            logging.info("✅ Bot shutdown complete")
        except Exception as e:
            logging.error(f"❌ Error during shutdown: {e}")

# Simplified main cog for essential commands
class MainCog(commands.Cog):
    """Main cog with essential bot commands"""
    
    def __init__(self, bot: ProfessionalBuilderBot):
        self.bot = bot

    @app_commands.command(name="help", description="Show all bot commands and usage")
    async def help(self, interaction: discord.Interaction):
        """Show bot commands and usage information"""
        
        # Track command usage
        if interaction.guild_id:
            await track_command_usage(
                user_id=str(interaction.user.id),
                guild_id=str(interaction.guild_id),
                command_name="help"
            )
        
        embed = discord.Embed(
            title="🤖 BuildForMe Bot Commands",
            description="AI-powered Discord server management and building tools",
            color=0x5865F2
        )
        
        embed.add_field(
            name="🆓 Free Commands",
            value=(
                "`/help` - Show this help message\n"
                "`/command-hub` - Create protected admin channel\n"
                "`/check-permissions` - Check bot permissions\n"
                "`/admin-setup` - Create admin channels"
            ),
            inline=False
        )
        
        embed.add_field(
            name="🤖 AI Commands (Subscription Required)",
            value=(
                "`/setup` - AI-powered server setup\n"
                "`/add-channels` - Add channels with AI naming\n"
                "`/add-roles` - Add roles with AI suggestions\n"
                "`/ai-cleanup` - AI server optimization\n"
                "`/fix-permissions` - AI permission analysis"
            ),
            inline=False
        )
        
        embed.add_field(
            name="💳 Get AI Features",
            value="Visit [buildforme.xyz](https://buildforme.xyz) to upgrade!",
            inline=False
        )
        
        embed.set_footer(text="BuildForMe Bot • Professional Server Management")
        
        await interaction.response.send_message(embed=embed, ephemeral=True)

    @app_commands.command(name="command-hub", description="Create or show the protected admin command hub")
    @is_admin()
    async def command_hub(self, interaction: discord.Interaction):
        """Create or show admin command hub"""
        if not interaction.guild:
            await interaction.response.send_message("❌ This command can only be used in servers.", ephemeral=True)
            return
            
        try:
            admin_channel = await CoreHelper.ensure_admin_channel(interaction.guild)
            
            if admin_channel:
                embed = discord.Embed(
                    title="🛡️ Command Hub",
                    description=f"Admin channel: {admin_channel.mention}",
                    color=0x00FF00
                )
                embed.add_field(
                    name="Purpose",
                    value="This channel is protected from all bot operations and is safe for admin commands.",
                    inline=False
                )
            else:
                embed = discord.Embed(
                    title="❌ Command Hub Error",
                    description="Could not create admin channel. Please check bot permissions.",
                    color=0xFF0000
                )
            
            await interaction.response.send_message(embed=embed, ephemeral=True)
            
        except Exception as e:
            logging.error(f"Command hub error: {e}")
            await interaction.response.send_message(
                "❌ Error creating command hub. Please check bot permissions.",
                ephemeral=True
            )

    @app_commands.command(name="check-permissions", description="Check bot permissions and diagnose issues")
    @is_admin()
    async def check_permissions(self, interaction: discord.Interaction):
        """Check bot permissions"""
        try:
            guild = interaction.guild
            bot_member = guild.me
            
            embed = discord.Embed(
                title="🔍 Permission Check",
                description=f"Checking permissions for {bot_member.mention}",
                color=0x7289DA
            )
            
            # Check key permissions
            perms = bot_member.guild_permissions
            perm_checks = {
                "Administrator": perms.administrator,
                "Manage Channels": perms.manage_channels,
                "Manage Roles": perms.manage_roles,
                "Send Messages": perms.send_messages,
                "Embed Links": perms.embed_links,
                "Manage Messages": perms.manage_messages,
                "Read Message History": perms.read_message_history
            }
            
            perm_text = ""
            for perm_name, has_perm in perm_checks.items():
                status = "✅" if has_perm else "❌"
                perm_text += f"{status} {perm_name}\n"
            
            embed.add_field(name="Permissions", value=perm_text, inline=False)
            
            # Check role hierarchy
            highest_role = bot_member.top_role
            embed.add_field(
                name="Role Info",
                value=f"Highest Role: {highest_role.mention}\nPosition: {highest_role.position}",
                inline=False
            )
            
            await interaction.response.send_message(embed=embed, ephemeral=True)
            
        except Exception as e:
            logging.error(f"Permission check error: {e}")
            await interaction.response.send_message(
                "❌ Error checking permissions.",
                ephemeral=True
            )

    @app_commands.command(name="admin-setup", description="⚡ Create admin and mod channels/categories")
    @app_commands.describe(
        create_admin="Create admin category and channels?",
        create_mod="Create moderation category and channels?"
    )
    @is_admin()
    async def admin_setup(self, interaction: discord.Interaction, create_admin: bool = True, create_mod: bool = True):
        """Set up admin and moderation channels"""
        await interaction.response.defer()
        
        try:
            guild = interaction.guild
            created_items = []
            
            if create_admin:
                # Create admin category
                admin_overwrites = {
                    guild.default_role: discord.PermissionOverwrite(read_messages=False),
                    guild.me: discord.PermissionOverwrite(read_messages=True, send_messages=True)
                }
                
                # Add admin roles
                for role in guild.roles:
                    if role.permissions.administrator and not role.is_bot_managed():
                        admin_overwrites[role] = discord.PermissionOverwrite(read_messages=True, send_messages=True)
                
                admin_category = await guild.create_category(
                    "🔒 ADMINISTRATION",
                    overwrites=admin_overwrites,
                    reason="Admin setup by BuildForMe Bot"
                )
                created_items.append(f"Category: {admin_category.name}")
                
                # Create admin channels
                admin_channels = ["admin-chat", "bot-commands", "server-logs"]
                for channel_name in admin_channels:
                    channel = await guild.create_text_channel(
                        channel_name,
                        category=admin_category,
                        reason="Admin setup by BuildForMe Bot"
                    )
                    created_items.append(f"Channel: #{channel.name}")
            
            if create_mod:
                # Create moderation category
                mod_overwrites = {
                    guild.default_role: discord.PermissionOverwrite(read_messages=False),
                    guild.me: discord.PermissionOverwrite(read_messages=True, send_messages=True)
                }
                
                mod_category = await guild.create_category(
                    "⚖️ MODERATION",
                    overwrites=mod_overwrites,
                    reason="Mod setup by BuildForMe Bot"
                )
                created_items.append(f"Category: {mod_category.name}")
                
                # Create mod channels
                mod_channels = ["mod-chat", "mod-logs", "reports"]
                for channel_name in mod_channels:
                    channel = await guild.create_text_channel(
                        channel_name,
                        category=mod_category,
                        reason="Mod setup by BuildForMe Bot"
                    )
                    created_items.append(f"Channel: #{channel.name}")
            
            embed = discord.Embed(
                title="✅ Admin Setup Complete",
                description="Successfully created admin infrastructure",
                color=0x00FF00
            )
            embed.add_field(
                name="Created Items",
                value="\n".join(created_items) if created_items else "None",
                inline=False
            )
            
            await interaction.followup.send(embed=embed)
            
        except discord.Forbidden:
            await interaction.followup.send(
                "❌ I don't have permission to create channels/categories. Please check my role permissions.",
                ephemeral=True
            )
        except Exception as e:
            logging.error(f"Admin setup error: {e}")
            await interaction.followup.send(
                "❌ An error occurred during admin setup.",
                ephemeral=True
            )

    @app_commands.command(name="setup", description="🤖 AI-powered comprehensive server setup")
    @app_commands.describe(
        theme="Server theme (Gaming, Study, Tech, Art, etc.)",
        channels="Number of channels to create",
        categories="Number of categories to create", 
        use_ai="Use AI for structure and naming?",
        custom_roles="Create custom roles?",
        role_count="Number of custom roles (if creating roles)",
        role_theme="Use theme-based role naming?",
        role_colors="Role color scheme",
        embeds="Add informational embeds?",
        ai_embeds="Use AI for custom embed content?",
        moderation_logs="Create moderation log channels?"
    )
    @ai_subscription_required()
    @is_admin()
    async def setup(self, interaction, 
                   theme: str,
                   channels: int,
                   categories: int,
                   use_ai: bool = True,
                   custom_roles: bool = True,
                   role_count: int = 5,
                   role_theme: bool = True,
                   role_colors: str = 'theme-based',
                   embeds: bool = True,
                   ai_embeds: bool = False,
                   moderation_logs: bool = True):
        
        await interaction.response.defer(thinking=True, ephemeral=True)
        assert interaction.guild is not None
        
        if use_ai:
            system_prompt = """Create a Discord server blueprint. Return only valid JSON with this structure:
{
    "categories": [{"name": "Category Name", "channels": [{"name": "channel-name", "type": "text"}]}],
    "roles": [{"name": "Role Name", "color": "#hexcolor"}],
    "welcome_message": "Welcome message text",
    "rules": ["Rule 1", "Rule 2", "Rule 3"]
}"""

            user_prompt = f"""Theme: {theme}
Channels: {channels}
Categories: {categories}
Roles: {role_count if custom_roles else 0}
Role Theme: {role_theme}
Role Colors: {role_colors}
Embeds: {embeds}"""

            response = await self.bot.ai_service.generate_response(system_prompt, user_prompt)
            
            if response:
                try:
                    blueprint = json.loads(response)
                    success = await self._build_server_ai(interaction, blueprint, role_colors, embeds, ai_embeds, moderation_logs)
                    if success:
                        await interaction.followup.send("✅ AI server build completed successfully!", ephemeral=True)
                    else:
                        await interaction.followup.send("❌ AI server build failed", ephemeral=True)
                except json.JSONDecodeError:
                    await interaction.followup.send("❌ AI response was invalid", ephemeral=True)
            else:
                await interaction.followup.send("❌ AI service unavailable", ephemeral=True)
        else:
            success = await self._build_server_manual(interaction, theme, channels, categories, custom_roles, role_count, role_theme, role_colors, embeds, ai_embeds, moderation_logs)
            if success:
                await interaction.followup.send("✅ Manual server build completed successfully!", ephemeral=True)
            else:
                await interaction.followup.send("❌ Manual server build failed", ephemeral=True)

    async def _build_server_ai(self, interaction: discord.Interaction, blueprint: dict, role_colors: str, embeds: bool, ai_embeds: bool, moderation_logs: bool) -> bool:
        assert interaction.guild is not None
        guild = interaction.guild
        
        try:
            color_palette = CoreHelper.get_color_palette(role_colors if role_colors != 'theme-based' else 'gamer')
            
            if 'roles' in blueprint:
                for i, role_data in enumerate(blueprint['roles']):
                    try:
                        if role_colors == 'theme-based':
                            color = discord.Color(int(role_data.get('color', '#99aab5').replace('#', ''), 16))
                        else:
                            color = discord.Color(color_palette[i % len(color_palette)])
                        await guild.create_role(name=role_data['name'], color=color)
                    except Exception:
                        pass

            if 'categories' in blueprint:
                for cat_data in blueprint['categories']:
                    try:
                        category = await guild.create_category(cat_data['name'])
                        for channel_data in cat_data.get('channels', []):
                            if channel_data.get('type') == 'voice':
                                await guild.create_voice_channel(channel_data['name'], category=category)
                            else:
                                await guild.create_text_channel(channel_data['name'], category=category)
                    except Exception:
                        pass
            
            if moderation_logs:
                await self._create_moderation_system(guild)
            
            if embeds:
                await self._create_embeds(guild, blueprint, ai_embeds)
            
            return True
        except Exception:
            return False

    async def _build_server_manual(self, interaction: discord.Interaction, theme: str, channels: int, categories: int, custom_roles: bool, role_count: int, role_theme: bool, role_colors: str, embeds: bool, ai_embeds: bool, moderation_logs: bool) -> bool:
        assert interaction.guild is not None
        guild = interaction.guild
        
        try:
            color_palette = CoreHelper.get_color_palette(role_colors if role_colors != 'theme-based' else 'gamer')
            
            if custom_roles:
                for i in range(role_count):
                    try:
                        if role_theme:
                            role_name = f"{theme.title()} Member {i+1}"
                        else:
                            role_name = f"Role {i+1}"
                        
                        color = discord.Color(color_palette[i % len(color_palette)])
                        await guild.create_role(name=role_name, color=color)
                    except Exception:
                        pass

            for i in range(categories):
                try:
                    if role_theme:
                        cat_name = f"{theme.title()} Category {i+1}"
                    else:
                        cat_name = f"Category {i+1}"
                    
                    category = await guild.create_category(cat_name)
                    
                    channels_per_cat = max(1, channels // categories)
                    for j in range(channels_per_cat):
                        try:
                            if role_theme:
                                channel_name = f"{theme.lower()}-channel-{j+1}"
                            else:
                                channel_name = f"channel-{j+1}"
                            await guild.create_text_channel(channel_name, category=category)
                        except Exception:
                            pass
                except Exception:
                    pass
            
            if moderation_logs:
                await self._create_moderation_system(guild)
            
            if embeds:
                blueprint = {"welcome_message": f"Welcome to {guild.name}!", "rules": ["Be respectful", "No spam", "Follow Discord ToS"]}
                await self._create_embeds(guild, blueprint, ai_embeds)
            
            return True
        except Exception:
            return False

    async def _create_moderation_system(self, guild: discord.Guild):
        try:
            admin_overwrites = {
                guild.default_role: discord.PermissionOverwrite(read_messages=False),
                guild.me: discord.PermissionOverwrite(read_messages=True, send_messages=True)
            }
            
            if guild.owner:
                admin_overwrites[guild.owner] = discord.PermissionOverwrite(read_messages=True, send_messages=True)
            
            for role in guild.roles:
                if role.permissions.administrator:
                    admin_overwrites[role] = discord.PermissionOverwrite(read_messages=True, send_messages=True)
            
            mod_category = await guild.create_category("🛡️ Moderation", overwrites=admin_overwrites)
            await guild.create_text_channel("mod-logs", category=mod_category, topic="Moderation action logs")
            await guild.create_text_channel("admin-chat", category=mod_category, topic="Private admin discussion")
            await guild.create_text_channel("reports", category=mod_category, topic="User reports and issues")
            
        except Exception as e:
            logging.error(f"Failed to create moderation system: {e}")

    async def _create_embeds(self, guild: discord.Guild, blueprint: dict, ai_embeds: bool):
        try:
            general_channel = None
            for channel in guild.text_channels:
                if "general" in channel.name.lower() or "welcome" in channel.name.lower():
                    general_channel = channel
                    break
            
            if not general_channel:
                general_channel = guild.text_channels[0] if guild.text_channels else None
            
            if general_channel:
                if ai_embeds and hasattr(self.bot, 'ai_service'):
                    system_prompt = "Create Discord server welcome and rules embeds. Return JSON with embed content."
                    user_prompt = f"Server: {guild.name}, Theme: server theme, Create welcome message and rules"
                    response = await self.bot.ai_service.generate_response(system_prompt, user_prompt)
                    
                    if response:
                        try:
                            ai_content = json.loads(response)
                            welcome_msg = ai_content.get('welcome_message', blueprint.get('welcome_message', f'Welcome to {guild.name}!'))
                            rules = ai_content.get('rules', blueprint.get('rules', ['Be respectful', 'No spam', 'Follow Discord ToS']))
                        except:
                            welcome_msg = blueprint.get('welcome_message', f'Welcome to {guild.name}!')
                            rules = blueprint.get('rules', ['Be respectful', 'No spam', 'Follow Discord ToS'])
                    else:
                        welcome_msg = blueprint.get('welcome_message', f'Welcome to {guild.name}!')
                        rules = blueprint.get('rules', ['Be respectful', 'No spam', 'Follow Discord ToS'])
                else:
                    welcome_msg = blueprint.get('welcome_message', f'Welcome to {guild.name}!')
                    rules = blueprint.get('rules', ['Be respectful', 'No spam', 'Follow Discord ToS'])
                
                welcome_embed = discord.Embed(
                    title=f"Welcome to {guild.name}!",
                    description=welcome_msg,
                    color=discord.Color.blue()
                )
                
                rules_embed = discord.Embed(
                    title="📋 Server Rules",
                    description="\n".join([f"{i+1}. {rule}" for i, rule in enumerate(rules)]),
                    color=discord.Color.red()
                )
                
                await general_channel.send(embed=welcome_embed)
                await general_channel.send(embed=rules_embed)
                
        except Exception as e:
            logging.error(f"Failed to create embeds: {e}")

    @app_commands.command(name="add-channels", description="🤖 Add channels to the server (AI features available)")
    @app_commands.describe(
        count="Number of channels to create",
        names="Channel names (comma-separated)",
        use_ai="Use AI for themed naming?"
    )
    @ai_subscription_required()
    @is_admin()
    async def add_channels(self, interaction: discord.Interaction, count: int = 1, names: str = "", use_ai: bool = False):
        await interaction.response.defer(thinking=True, ephemeral=True)
        
        assert interaction.guild is not None
        
        if use_ai and names:
            system_prompt = "Generate themed Discord channel names. Return JSON array of channel names."
            user_prompt = f"Base names: {names}, Count: {count}, Theme: server appropriate"
            response = await self.bot.ai_service.generate_response(system_prompt, user_prompt)
            
            if response:
                try:
                    ai_names = json.loads(response)
                    names = ",".join(ai_names[:count])
                except:
                    pass
        
        if names:
            channel_names = [name.strip() for name in names.split(',')][:count]
        else:
            channel_names = [f"channel-{i+1}" for i in range(count)]
        
        created = 0
        for name in channel_names:
            try:
                await interaction.guild.create_text_channel(name)
                created += 1
            except Exception:
                pass
        
        await interaction.followup.send(f"✅ Created {created}/{len(channel_names)} channels")

    @app_commands.command(name="add-roles", description="🤖 Add roles to the server (AI features available)")
    @app_commands.describe(
        names="Role names (comma-separated)",
        use_ai="Use AI for naming/color suggestions?"
    )
    @ai_subscription_required()
    @is_admin()
    async def add_roles(self, interaction: discord.Interaction, names: str, use_ai: bool = False):
        await interaction.response.defer(thinking=True, ephemeral=True)
        
        assert interaction.guild is not None
        
        role_names = [name.strip() for name in names.split(',')]
        created = 0
        
        for name in role_names:
            try:
                color = discord.Color.random() if use_ai else discord.Color.default()
                await interaction.guild.create_role(name=name, color=color)
                created += 1
            except Exception:
                pass
        
        await interaction.followup.send(f"✅ Created {created}/{len(role_names)} roles")

    @app_commands.command(name="add-category", description="Add a category to the server")
    @app_commands.describe(name="Category name")
    @is_admin()
    async def add_category(self, interaction: discord.Interaction, name: str):
        await interaction.response.defer(thinking=True, ephemeral=True)
        
        assert interaction.guild is not None
        
        try:
            await interaction.guild.create_category(name)
            await interaction.followup.send(f"✅ Created category: {name}")
        except Exception:
            await interaction.followup.send("❌ Failed to create category")

    @app_commands.command(name="remove-channels", description="⚡ Remove channels from the server")
    @app_commands.describe(
        names="Channel names (comma-separated) or 'all'",
        all_channels="Remove all channels?"
    )
    @is_admin()
    async def remove_channels(self, interaction: discord.Interaction, names: str = "", all_channels: bool = False):
        await interaction.response.defer(thinking=True, ephemeral=True)
        
        assert interaction.guild is not None
        
        admin_channel = await CoreHelper.ensure_admin_channel(interaction.guild)
        deleted = 0
        
        if all_channels:
            for channel in list(interaction.guild.channels):
                if channel != admin_channel and channel.name != CoreHelper.ADMIN_CHANNEL_NAME:
                    try:
                        await channel.delete()
                        deleted += 1
                    except Exception:
                        pass
        elif names:
            target_names = [name.strip().lower() for name in names.split(',')]
            for channel in list(interaction.guild.channels):
                if channel.name.lower() in target_names and channel != admin_channel:
                    try:
                        await channel.delete()
                        deleted += 1
                    except Exception:
                        pass
        
        await interaction.followup.send(f"✅ Deleted {deleted} channels")

    @app_commands.command(name="remove-roles", description="⚡ Remove roles from the server")
    @app_commands.describe(
        names="Role names (comma-separated) or 'all'",
        all_roles="Remove all roles?"
    )
    @is_admin()
    async def remove_roles(self, interaction: discord.Interaction, names: str = "", all_roles: bool = False):
        await interaction.response.defer(thinking=True, ephemeral=True)
        
        assert interaction.guild is not None
        
        deleted = 0
        
        if all_roles:
            for role in list(interaction.guild.roles):
                if not role.is_default() and not role.managed and role < interaction.guild.me.top_role:
                    try:
                        await role.delete()
                        deleted += 1
                    except Exception:
                        pass
        elif names:
            target_names = [name.strip().lower() for name in names.split(',')]
            for role in list(interaction.guild.roles):
                if role.name.lower() in target_names and not role.is_default() and not role.managed:
                    try:
                        await role.delete()
                        deleted += 1
                    except Exception:
                        pass
        
        await interaction.followup.send(f"✅ Deleted {deleted} roles")

    @app_commands.command(name="remove-categories", description="⚡ Remove categories from the server")
    @app_commands.describe(
        names="Category names (comma-separated) or 'all'",
        all_categories="Remove all categories?"
    )
    @is_admin()
    async def remove_categories(self, interaction: discord.Interaction, names: str = "", all_categories: bool = False):
        await interaction.response.defer(thinking=True, ephemeral=True)
        
        assert interaction.guild is not None
        
        deleted = 0
        
        if all_categories:
            for category in list(interaction.guild.categories):
                if category.name != CoreHelper.ADMIN_CHANNEL_NAME:
                    try:
                        await category.delete()
                        deleted += 1
                    except Exception:
                        pass
        elif names:
            target_names = [name.strip().lower() for name in names.split(',')]
            for category in list(interaction.guild.categories):
                if category.name.lower() in target_names and category.name != CoreHelper.ADMIN_CHANNEL_NAME:
                    try:
                        await category.delete()
                        deleted += 1
                    except Exception:
                        pass
        
        await interaction.followup.send(f"✅ Deleted {deleted} categories")

    @app_commands.command(name="fix-permissions", description="🤖 Fix server permissions with AI analysis")
    @app_commands.describe(
        use_ai="Use AI to audit and auto-fix permissions?",
        basic_reset="Reset all roles to basic permissions?"
    )
    @ai_subscription_required()
    @is_admin()
    async def fix_permissions(self, interaction: discord.Interaction, use_ai: bool = True, basic_reset: bool = False):
        await interaction.response.defer(thinking=True, ephemeral=True)
        
        assert interaction.guild is not None
        guild = interaction.guild
        
        if use_ai:
            try:
                admin_channels = []
                mod_channels = []
                
                for category in guild.categories:
                    if any(word in category.name.lower() for word in ['admin', 'staff', 'management']):
                        admin_channels.extend(category.channels)
                    elif any(word in category.name.lower() for word in ['mod', 'moderation']):
                        mod_channels.extend(category.channels)
                
                admin_overwrites = {
                    guild.default_role: discord.PermissionOverwrite(read_messages=False),
                    guild.me: discord.PermissionOverwrite(read_messages=True, send_messages=True)
                }
                
                if guild.owner:
                    admin_overwrites[guild.owner] = discord.PermissionOverwrite(read_messages=True, send_messages=True)
                
                for role in guild.roles:
                    if role.permissions.administrator:
                        admin_overwrites[role] = discord.PermissionOverwrite(read_messages=True, send_messages=True)
                
                for channel in admin_channels:
                    try:
                        await channel.edit(overwrites=admin_overwrites)
                    except Exception:
                        pass
                
                mod_overwrites = admin_overwrites.copy()
                for role in guild.roles:
                    if any(perm for perm in [role.permissions.kick_members, role.permissions.ban_members, role.permissions.manage_messages] if perm):
                        mod_overwrites[role] = discord.PermissionOverwrite(read_messages=True, send_messages=True)
                
                for channel in mod_channels:
                    try:
                        await channel.edit(overwrites=mod_overwrites)
                    except Exception:
                        pass
                
                await interaction.followup.send("✅ AI permission analysis and fixes applied")
                
            except Exception as e:
                await interaction.followup.send(f"❌ AI permission fix failed: {str(e)}")
        
        if basic_reset:
            for role in guild.roles:
                if not role.is_default() and not role.managed:
                    try:
                        await role.edit(permissions=discord.Permissions())
                    except Exception:
                        pass
            await interaction.followup.send("✅ Basic permissions reset")

    @app_commands.command(name="backup", description="Create server backup")
    @is_admin()
    async def backup(self, interaction: discord.Interaction):
        await interaction.response.defer(thinking=True, ephemeral=True)
        
        assert interaction.guild is not None
        
        backup_data = {
            "server_name": interaction.guild.name,
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "roles": [{"name": r.name, "color": r.color.value, "permissions": r.permissions.value} 
                     for r in interaction.guild.roles if not r.is_default() and not r.managed],
            "categories": [],
            "channels": []
        }
        
        for category in interaction.guild.categories:
            if category.name != CoreHelper.ADMIN_CHANNEL_NAME:
                cat_data = {
                    "name": category.name,
                    "channels": [{"name": ch.name, "type": str(ch.type)} for ch in category.channels]
                }
                backup_data["categories"].append(cat_data)
        
        for channel in interaction.guild.channels:
            if not channel.category and channel.name != CoreHelper.ADMIN_CHANNEL_NAME:
                backup_data["channels"].append({"name": channel.name, "type": str(channel.type)})
        
        admin_channel = await CoreHelper.ensure_admin_channel(interaction.guild)
        if admin_channel:
            backup_json = json.dumps(backup_data, indent=2)
            backup_file = discord.File(
                fp=io.BytesIO(backup_json.encode('utf-8')),
                filename=f"backup-{interaction.guild.id}-{datetime.datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"
            )
            await admin_channel.send(f"📁 Backup created by {interaction.user.mention}", file=backup_file)
            await interaction.followup.send("✅ Backup saved to command hub")
        else:
            await interaction.followup.send("❌ Could not create backup")

    @app_commands.command(name="restore", description="Restore from backup")
    @is_admin()
    async def restore(self, interaction: discord.Interaction):
        await interaction.response.send_message("📁 Please upload a backup JSON file to restore from", ephemeral=True)

    @app_commands.command(name="theme", description="🤖 Apply new theme to server")
    @app_commands.describe(
        new_theme="New theme to apply",
        rename_only="Only rename channels/roles without restructuring?",
        use_ai="Use AI for theme application?"
    )
    @ai_subscription_required()
    @is_admin()
    async def theme(self, interaction: discord.Interaction, new_theme: str, rename_only: bool = False, use_ai: bool = True):
        await interaction.response.defer(thinking=True, ephemeral=True)
        
        assert interaction.guild is not None
        
        if use_ai and rename_only:
            system_prompt = "Generate new channel and role names based on theme. Return JSON with name mappings."
            user_prompt = f"Theme: {new_theme}, Current channels: {[ch.name for ch in interaction.guild.channels[:10]]}"
            response = await self.bot.ai_service.generate_response(system_prompt, user_prompt)
            
            if response:
                await interaction.followup.send(f"✅ Theme '{new_theme}' applied with AI renaming")
            else:
                await interaction.followup.send("❌ AI theme generation failed")
        else:
            await interaction.followup.send(f"✅ Theme '{new_theme}' applied")

    @app_commands.command(name="clean-messages", description="Clean messages from channels")
    @app_commands.describe(
        channels="Channel names (comma-separated) or 'all'",
        all_channels="Clean all channels?",
        limit="Number of messages to delete (max 100)"
    )
    @is_admin()
    async def clean_messages(self, interaction: discord.Interaction, channels: str = "all", all_channels: bool = True, limit: int = 100):
        await interaction.response.defer(thinking=True, ephemeral=True)
        
        assert interaction.guild is not None
        
        cleaned = 0
        target_channels = []
        
        if all_channels:
            target_channels = [ch for ch in interaction.guild.text_channels if ch.name != CoreHelper.ADMIN_CHANNEL_NAME]
        elif channels != "all":
            target_names = [name.strip().lower() for name in channels.split(',')]
            target_channels = [ch for ch in interaction.guild.text_channels 
                             if ch.name.lower() in target_names and ch.name != CoreHelper.ADMIN_CHANNEL_NAME]
        
        for channel in target_channels:
            try:
                deleted = await channel.purge(limit=min(limit, 100))
                cleaned += len(deleted)
            except Exception:
                pass
        
        await interaction.followup.send(f"✅ Cleaned {cleaned} messages from {len(target_channels)} channels")

    @app_commands.command(name="clean-reactions", description="Clean reactions from channels")
    @app_commands.describe(
        channels="Channel names (comma-separated) or 'all'",
        all_channels="Clean all channels?"
    )
    @is_admin()
    async def clean_reactions(self, interaction: discord.Interaction, channels: str = "all", all_channels: bool = True):
        await interaction.response.defer(thinking=True, ephemeral=True)
        
        assert interaction.guild is not None
        
        cleaned = 0
        target_channels = []
        
        if all_channels:
            target_channels = [ch for ch in interaction.guild.text_channels if ch.name != CoreHelper.ADMIN_CHANNEL_NAME]
        elif channels != "all":
            target_names = [name.strip().lower() for name in channels.split(',')]
            target_channels = [ch for ch in interaction.guild.text_channels 
                             if ch.name.lower() in target_names and ch.name != CoreHelper.ADMIN_CHANNEL_NAME]
        
        for channel in target_channels:
            try:
                async for message in channel.history(limit=100):
                    await message.clear_reactions()
                    cleaned += 1
            except Exception:
                pass
        
        await interaction.followup.send(f"✅ Cleaned reactions from {cleaned} messages in {len(target_channels)} channels")

    @app_commands.command(name="nuke", description="Complete server reset (DESTRUCTIVE)")
    @app_commands.describe(confirmation="Type the exact server name to confirm")
    @is_admin()
    async def nuke(self, interaction: discord.Interaction, confirmation: str):
        assert interaction.guild is not None
        
        if confirmation != interaction.guild.name:
            await interaction.response.send_message("❌ Confirmation failed. Type exact server name.", ephemeral=True)
            return
        
        await interaction.response.defer(thinking=True, ephemeral=True)
        
        admin_channel = await CoreHelper.ensure_admin_channel(interaction.guild)
        deleted = {"channels": 0, "roles": 0, "categories": 0}
        
        for channel in list(interaction.guild.channels):
            if channel != admin_channel and channel.name != CoreHelper.ADMIN_CHANNEL_NAME:
                try:
                    if isinstance(channel, discord.CategoryChannel):
                        deleted["categories"] += 1
                    else:
                        deleted["channels"] += 1
                    await channel.delete()
                except Exception:
                    pass
        
        for role in list(interaction.guild.roles):
            if not role.is_default() and not role.managed and role < interaction.guild.me.top_role:
                try:
                    await role.delete()
                    deleted["roles"] += 1
                except Exception:
                    pass
        
        try:
            await interaction.followup.send(f"💥 Nuke complete: {deleted['channels']} channels, {deleted['categories']} categories, {deleted['roles']} roles deleted")
        except discord.NotFound:
            if admin_channel:
                await admin_channel.send(f"💥 Nuke complete: {deleted['channels']} channels, {deleted['categories']} categories, {deleted['roles']} roles deleted")

    @app_commands.command(name="ai-cleanup", description="🤖 Interactive AI-powered server structure optimization")
    @app_commands.describe(
        analysis_depth="How deep should the AI analyze?",
        focus_area="What area to focus cleanup on?"
    )
    @ai_subscription_required()
    @is_admin()
    async def ai_cleanup(self, interaction: discord.Interaction, 
                        analysis_depth: str = 'detailed',
                        focus_area: str = 'all'):
        await interaction.response.defer(thinking=True, ephemeral=True)
        
        assert interaction.guild is not None
        guild = interaction.guild
        
        analysis_data = await self._analyze_server_structure(guild, analysis_depth, focus_area)
        
        if not analysis_data:
            await interaction.followup.send("❌ Failed to analyze server structure", ephemeral=True)
            return
        
        system_prompt = f"""Analyze Discord server structure. Return JSON with CONSERVATIVE, SAFE recommendations.
CRITICAL: NEVER suggest moving/deleting these protected channels: command, hub, admin, mod, staff, log, audit, announcement, welcome, rules, general, important.

{{
    "issues": [
        {{
            "type": "permission_redundancy|naming_inconsistency",
            "severity": "low|medium",
            "description": "Brief 1-line issue description",
            "current_state": "What's wrong",
            "proposed_solution": "Safe, minimal change",
            "affected_items": ["exact channel/role names - VERIFY THESE EXIST"],
            "auto_fixable": true/false
        }}
    ],
    "optimization_suggestions": [
        {{
            "category": "structure|permissions|naming",
            "suggestion": "Conservative suggestion",
            "benefits": "Why this helps",
            "requires_confirmation": true/false
        }}
    ]
}}

RULES:
- Only suggest renaming channels with spaces to use dashes
- Only suggest removing redundant permission overwrites (not actual permissions)
- NEVER suggest deleting or moving important channels
- NEVER suggest role deletions or major permission changes
- Be extremely conservative - when in doubt, don't suggest the fix"""

        user_prompt = f"""Server: {guild.name}
Analysis Depth: {analysis_depth}
Focus Area: {focus_area}
Data: {json.dumps(analysis_data, indent=2)}

Identify specific issues and provide actionable recommendations."""

        try:
            response = await asyncio.wait_for(
                self.bot.ai_service.generate_response(system_prompt, user_prompt), 
                timeout=30.0
            )
            
            if response:
                try:
                    cleanup_plan = json.loads(response)
                    logging.info(f"AI cleanup plan generated: {len(cleanup_plan.get('issues', []))} issues found")
                    await self._start_interactive_cleanup(interaction, cleanup_plan)
                except json.JSONDecodeError as e:
                    logging.error(f"Failed to parse AI response: {e}")
                    await interaction.followup.send("❌ AI analysis failed to parse response", ephemeral=True)
            else:
                await interaction.followup.send("❌ AI analysis service returned empty response", ephemeral=True)
        except asyncio.TimeoutError:
            await interaction.followup.send("❌ AI analysis timed out (30s limit)", ephemeral=True)
        except Exception as e:
            logging.error(f"AI cleanup failed: {e}")
            await interaction.followup.send(f"❌ AI cleanup failed: {str(e)}", ephemeral=True)

    async def _analyze_server_structure(self, guild: discord.Guild, depth: str, focus: str) -> Dict[str, Any]:
        try:
            analysis = {
                "server_name": guild.name,
                "member_count": guild.member_count,
                "roles": [],
                "channels": [],
                "categories": [],
                "permission_analysis": {},
                "structure_issues": []
            }
            
            for role in guild.roles:
                if not role.is_default():
                    role_data = {
                        "name": role.name,
                        "position": role.position,
                        "permissions": role.permissions.value,
                        "color": role.color.value,
                        "mentionable": role.mentionable,
                        "hoist": role.hoist,
                        "member_count": len(role.members)
                    }
                    analysis["roles"].append(role_data)
            
            for category in guild.categories:
                if category.name != CoreHelper.ADMIN_CHANNEL_NAME and not CoreHelper.is_protected_channel(category.name):
                    cat_data = {
                        "name": category.name,
                        "position": category.position,
                        "channels": [],
                        "overwrites": len(category.overwrites)
                    }
                    
                    for channel in category.channels:
                        # Skip protected channels from AI analysis
                        if not CoreHelper.is_protected_channel(channel.name):
                            channel_data = {
                                "name": channel.name,
                                "full_name": f"{category.name}/{channel.name}",
                                "type": str(channel.type),
                                "position": channel.position,
                                "overwrites": len(channel.overwrites),
                                "topic": getattr(channel, 'topic', None),
                                "nsfw": getattr(channel, 'nsfw', False)
                            }
                            cat_data["channels"].append(channel_data)
                    
                    analysis["categories"].append(cat_data)
            
            for channel in guild.channels:
                if (not channel.category and 
                    channel.name != CoreHelper.ADMIN_CHANNEL_NAME and 
                    not CoreHelper.is_protected_channel(channel.name)):
                    channel_data = {
                        "name": channel.name,
                        "type": str(channel.type),
                        "position": channel.position,
                        "overwrites": len(channel.overwrites),
                        "topic": getattr(channel, 'topic', None),
                        "nsfw": getattr(channel, 'nsfw', False),
                        "category": None
                    }
                    analysis["channels"].append(channel_data)
            
            if depth in ['detailed', 'comprehensive']:
                analysis["permission_analysis"] = await self._analyze_permissions(guild)
            
            if depth == 'comprehensive':
                analysis["naming_patterns"] = self._analyze_naming_patterns(guild)
                analysis["usage_patterns"] = await self._analyze_usage_patterns(guild)
            
            return analysis
            
        except Exception as e:
            logging.error(f"Server analysis failed: {e}")
            return {}

    async def _analyze_permissions(self, guild: discord.Guild) -> Dict[str, Any]:
        permission_issues = []
        
        for channel in guild.channels:
            if (channel.name == CoreHelper.ADMIN_CHANNEL_NAME or 
                CoreHelper.is_protected_channel(channel.name)):
                continue
                
            channel_overwrites = channel.overwrites
            default_role = guild.default_role
            
            if default_role in channel_overwrites:
                default_perms = channel_overwrites[default_role]
                
                redundant_perms = []
                if default_perms.read_messages is not None:
                    if default_perms.read_messages == default_role.permissions.read_messages:
                        redundant_perms.append("read_messages")
                
                if redundant_perms:
                    permission_issues.append({
                        "channel": channel.name,
                        "issue": "redundant_permissions",
                        "details": redundant_perms
                    })
        
        return {"issues": permission_issues}

    def _analyze_naming_patterns(self, guild: discord.Guild) -> Dict[str, Any]:
        patterns = {
            "inconsistent_naming": [],
            "suggested_renames": []
        }
        
        channel_names = [ch.name for ch in guild.text_channels 
                        if ch.name != CoreHelper.ADMIN_CHANNEL_NAME and 
                        not CoreHelper.is_protected_channel(ch.name)]
        
        for name in channel_names:
            if ' ' in name:
                patterns["inconsistent_naming"].append({
                    "current": name,
                    "issue": "contains_spaces",
                    "suggested": name.replace(' ', '-').lower()
                })
        
        return patterns

    async def _analyze_usage_patterns(self, guild: discord.Guild) -> Dict[str, Any]:
        patterns = {
            "inactive_channels": [],
            "potential_read_only": []
        }
        
        for channel in guild.text_channels:
            if (channel.name == CoreHelper.ADMIN_CHANNEL_NAME or 
                CoreHelper.is_protected_channel(channel.name)):
                continue
                
            try:
                messages = []
                async for message in channel.history(limit=10):
                    messages.append({
                        "author_bot": message.author.bot,
                        "webhook": message.webhook_id is not None
                    })
                
                if messages:
                    bot_messages = sum(1 for m in messages if m["author_bot"] or m["webhook"])
                    if bot_messages / len(messages) > 0.8:
                        patterns["potential_read_only"].append({
                            "channel": channel.name,
                            "bot_ratio": bot_messages / len(messages)
                        })
                else:
                    patterns["inactive_channels"].append(channel.name)
                    
            except Exception:
                pass
        
        return patterns

    async def _start_interactive_cleanup(self, interaction: discord.Interaction, cleanup_plan: Dict[str, Any]):
        try:
            issues = cleanup_plan.get("issues", [])
            suggestions = cleanup_plan.get("optimization_suggestions", [])
            
            logging.info(f"Starting interactive cleanup: {len(issues)} issues, {len(suggestions)} suggestions")
            
            if not issues and not suggestions:
                await interaction.followup.send("✅ No issues found! Your server structure looks good.", ephemeral=True)
                return
            
            embed = discord.Embed(
                title="🔍 Server Analysis Complete",
                description=f"Found {len(issues)} issues and {len(suggestions)} optimization opportunities",
                color=discord.Color.orange()
            )
            
            if issues:
                high_issues = [i for i in issues if i.get("severity") == "high"]
                medium_issues = [i for i in issues if i.get("severity") == "medium"]
                low_issues = [i for i in issues if i.get("severity") == "low"]
                
                if high_issues:
                    embed.add_field(
                        name="🚨 High Priority Issues",
                        value="\n".join([f"• {issue.get('description', 'No description')}" for issue in high_issues[:3]]),
                        inline=False
                    )
                
                if medium_issues:
                    embed.add_field(
                        name="⚠️ Medium Priority Issues",
                        value="\n".join([f"• {issue.get('description', 'No description')}" for issue in medium_issues[:3]]),
                        inline=False
                    )
            
            if suggestions:
                embed.add_field(
                    name="💡 Optimization Suggestions",
                    value="\n".join([f"• {suggestion.get('suggestion', 'No suggestion')}" for suggestion in suggestions[:3]]),
                    inline=False
                )
            
            embed.add_field(
                name="Next Steps",
                value="Use the buttons below to proceed with cleanup",
                inline=False
            )
            
            # Create buttons for interaction instead of reactions
            view = CleanupView(self, interaction.user, cleanup_plan)
            
            logging.info("Sending cleanup interface to user")
            await interaction.followup.send(embed=embed, view=view, ephemeral=True)
            logging.info("Cleanup interface sent successfully")
            
        except Exception as e:
            logging.error(f"Failed in _start_interactive_cleanup: {e}")
            await interaction.followup.send(f"❌ Failed to start cleanup interface: {str(e)}", ephemeral=True)

    async def _process_cleanup_interactively(self, interaction: discord.Interaction, cleanup_plan: Dict[str, Any], message: discord.Message):
        issues = cleanup_plan.get("issues", [])
        current_issue = 0
        applied_fixes = []
        
        for i, issue in enumerate(issues):
            if current_issue >= len(issues):
                break
                
            embed = discord.Embed(
                title=f"🔧 Issue {i+1}/{len(issues)}: {issue['type'].replace('_', ' ').title()}",
                description=issue['description'],
                color=discord.Color.blue()
            )
            
            embed.add_field(name="Current State", value=issue['current_state'], inline=False)
            embed.add_field(name="Proposed Solution", value=issue['proposed_solution'], inline=False)
            
            if issue.get('affected_items'):
                embed.add_field(
                    name="Affected Items",
                    value=", ".join(issue['affected_items'][:5]),
                    inline=False
                )
            
            embed.add_field(
                name="Options",
                value="✅ Apply fix\n❌ Skip this issue\n⏭️ Skip all remaining\n🛑 Stop cleanup",
                inline=False
            )
            
            await message.edit(embed=embed)
            
            try:
                await message.clear_reactions()
                await message.add_reaction("✅")
                await message.add_reaction("❌")
                await message.add_reaction("⏭️")
                await message.add_reaction("🛑")
            except Exception:
                pass
            
            def check(reaction, user):
                return (user == interaction.user and 
                       str(reaction.emoji) in ["✅", "❌", "⏭️", "🛑"] and 
                       reaction.message.id == message.id)
            
            try:
                reaction, user = await self.bot.wait_for('reaction_add', timeout=120.0, check=check)
                
                if str(reaction.emoji) == "✅":
                    assert interaction.guild is not None
                    success = await self._apply_fix(interaction.guild, issue)
                    if success:
                        applied_fixes.append(issue['description'])
                        
                elif str(reaction.emoji) == "⏭️":
                    break
                elif str(reaction.emoji) == "🛑":
                    break
                    
            except asyncio.TimeoutError:
                break
        
        final_embed = discord.Embed(
            title="🎉 Cleanup Complete!",
            description=f"Applied {len(applied_fixes)} fixes",
            color=discord.Color.green()
        )
        
        if applied_fixes:
            final_embed.add_field(
                name="Applied Fixes",
                value="\n".join([f"✅ {fix}" for fix in applied_fixes[:10]]),
                inline=False
            )
        
        await message.edit(embed=final_embed)
        try:
            await message.clear_reactions()
        except Exception:
            pass

    async def _process_cleanup_with_buttons(self, interaction: discord.Interaction, cleanup_plan: Dict[str, Any]):
        try:
            issues = cleanup_plan.get("issues", [])
            logging.info(f"Processing cleanup for {len(issues)} issues")
            
            if not issues:
                await interaction.followup.send("✅ No issues to fix!", ephemeral=True)
                return
            
            applied_fixes = []
            for i, issue in enumerate(issues):
                logging.info(f"Processing issue {i+1}/{len(issues)}: {issue.get('type', 'unknown')}")
                
                embed = discord.Embed(
                    title=f"🔧 Issue {i+1}/{len(issues)}: {issue.get('type', 'Unknown').replace('_', ' ').title()}",
                    description=issue.get('description', 'No description available'),
                    color=discord.Color.blue()
                )
                
                embed.add_field(name="Current State", value=issue.get('current_state', 'Not specified'), inline=False)
                embed.add_field(name="Proposed Solution", value=issue.get('proposed_solution', 'Not specified'), inline=False)
                
                if issue.get('affected_items'):
                    embed.add_field(
                        name="Affected Items",
                        value=", ".join(issue['affected_items'][:5]),
                        inline=False
                    )
                
                view = IssueFixView(self, interaction.user, issue, i+1, len(issues))
                await interaction.followup.send(embed=embed, view=view, ephemeral=True)
                
                # Wait for user decision with timeout
                try:
                    result = await asyncio.wait_for(view.wait_for_result(), timeout=120.0)
                    logging.info(f"User decision for issue {i+1}: {result}")
                    
                    if result == "apply":
                        applied_fixes.append(issue.get('description', f'Issue {i+1}'))
                    elif result == "stop":
                        logging.info("User requested to stop cleanup")
                        break
                except asyncio.TimeoutError:
                    logging.warning(f"Timeout waiting for user decision on issue {i+1}")
                    break
            
            logging.info(f"Cleanup complete. Applied {len(applied_fixes)} fixes")
            
            final_embed = discord.Embed(
                title="🎉 Cleanup Complete!",
                description=f"Applied {len(applied_fixes)} fixes",
                color=discord.Color.green()
            )
            
            if applied_fixes:
                final_embed.add_field(
                    name="Applied Fixes",
                    value="\n".join([f"✅ {fix}" for fix in applied_fixes[:10]]),
                    inline=False
                )
            
            await interaction.followup.send(embed=final_embed, ephemeral=True)
            
        except Exception as e:
            logging.error(f"Error in _process_cleanup_with_buttons: {e}")
            await interaction.followup.send(f"❌ Cleanup failed: {str(e)}", ephemeral=True)

    async def _show_detailed_report_button(self, interaction: discord.Interaction, cleanup_plan: Dict[str, Any]):
        issues = cleanup_plan.get("issues", [])
        suggestions = cleanup_plan.get("optimization_suggestions", [])
        
        report_embed = discord.Embed(
            title="📋 Detailed Server Analysis Report",
            color=discord.Color.blue()
        )
        
        if issues:
            high_issues = [i for i in issues if i.get("severity") == "high"]
            medium_issues = [i for i in issues if i.get("severity") == "medium"]
            low_issues = [i for i in issues if i.get("severity") == "low"]
            
            if high_issues:
                report_embed.add_field(
                    name="🚨 High Priority Issues",
                    value="\n".join([f"• {issue['description']}" for issue in high_issues]),
                    inline=False
                )
            
            if medium_issues:
                report_embed.add_field(
                    name="⚠️ Medium Priority Issues",
                    value="\n".join([f"• {issue['description']}" for issue in medium_issues]),
                    inline=False
                )
            
            if low_issues:
                report_embed.add_field(
                    name="ℹ️ Low Priority Issues",
                    value="\n".join([f"• {issue['description']}" for issue in low_issues]),
                    inline=False
                )
        
        if suggestions:
            report_embed.add_field(
                name="💡 Optimization Suggestions",
                value="\n".join([f"• {suggestion['suggestion']}" for suggestion in suggestions]),
                inline=False
            )
        
        await interaction.followup.send(embed=report_embed, ephemeral=True)

    async def _show_detailed_report(self, interaction: discord.Interaction, cleanup_plan: Dict[str, Any], message: discord.Message):
        issues = cleanup_plan.get("issues", [])
        suggestions = cleanup_plan.get("optimization_suggestions", [])
        
        report_embed = discord.Embed(
            title="📋 Detailed Server Analysis Report",
            color=discord.Color.blue()
        )
        
        if issues:
            high_issues = [i for i in issues if i.get("severity") == "high"]
            medium_issues = [i for i in issues if i.get("severity") == "medium"]
            low_issues = [i for i in issues if i.get("severity") == "low"]
            
            if high_issues:
                report_embed.add_field(
                    name="🚨 High Priority Issues",
                    value="\n".join([f"• {issue['description']}" for issue in high_issues]),
                    inline=False
                )
            
            if medium_issues:
                report_embed.add_field(
                    name="⚠️ Medium Priority Issues",
                    value="\n".join([f"• {issue['description']}" for issue in medium_issues]),
                    inline=False
                )
            
            if low_issues:
                report_embed.add_field(
                    name="ℹ️ Low Priority Issues",
                    value="\n".join([f"• {issue['description']}" for issue in low_issues]),
                    inline=False
                )
        
        if suggestions:
            report_embed.add_field(
                name="💡 Optimization Suggestions",
                value="\n".join([f"• {suggestion['suggestion']}" for suggestion in suggestions]),
                inline=False
            )
        
        await message.edit(embed=report_embed)
        try:
            await message.clear_reactions()
        except Exception:
            pass

    async def _apply_fix(self, guild: discord.Guild, issue: Dict[str, Any]) -> bool:
        """Legacy method - use _apply_fix_safely instead"""
        success, message = await self._apply_fix_safely(guild, issue)
        return success

    async def _apply_fix_safely(self, guild: discord.Guild, issue: Dict[str, Any]) -> tuple[bool, str]:
        """
        Safely applies a fix, returning a tuple (success, message).
        Handles common edge cases and provides user-friendly messages.
        """
        try:
            issue_type = issue['type']
            affected_items = issue.get('affected_items', [])
            bot_member = guild.me
            
            # Check if bot has necessary permissions
            if not bot_member.guild_permissions.manage_channels:
                return False, "Bot lacks 'Manage Channels' permission. Cannot apply fix."
            if not bot_member.guild_permissions.manage_roles:
                return False, "Bot lacks 'Manage Roles' permission. Cannot apply fix."
            if not bot_member.guild_permissions.manage_permissions:
                return False, "Bot lacks 'Manage Permissions' permission. Cannot apply fix."
            
            if issue_type == "permission_redundancy":
                fixed_count = 0
                for item_name in affected_items:
                    channel = discord.utils.get(guild.channels, name=item_name)
                    if channel:
                        # SAFETY CHECK: Never touch protected channels
                        if CoreHelper.is_protected_channel(channel.name):
                            logging.warning(f"Skipping protected channel: {channel.name}")
                            continue
                            
                        if guild.default_role in channel.overwrites:
                            if not channel.permissions_for(bot_member).manage_permissions:
                                return False, f"Bot lacks permission to manage {channel.name}. Cannot apply fix."
                            overwrite = channel.overwrites[guild.default_role]
                            if overwrite.read_messages == guild.default_role.permissions.read_messages:
                                new_overwrite = discord.PermissionOverwrite.from_pair(
                                    overwrite.pair()[0], overwrite.pair()[1]
                                )
                                new_overwrite.read_messages = None
                                await channel.set_permissions(guild.default_role, overwrite=new_overwrite)
                                logging.info(f"Removed redundant read_messages permission from {channel.name}")
                                fixed_count += 1
                
                return True, f"✅ Removed redundant permissions from {fixed_count} channels."
                
            elif issue_type == "naming_inconsistency":
                fixed_count = 0
                for item_name in affected_items:
                    channel = discord.utils.get(guild.channels, name=item_name)
                    if channel and ' ' in channel.name:
                        # SAFETY CHECK: Never touch protected channels
                        if CoreHelper.is_protected_channel(channel.name):
                            logging.warning(f"Skipping protected channel: {channel.name}")
                            continue
                            
                        if not channel.permissions_for(bot_member).manage_channels:
                            return False, f"Bot lacks permission to rename {channel.name}. Cannot apply fix."
                        new_name = channel.name.replace(' ', '-').lower()
                        await channel.edit(name=new_name)
                        logging.info(f"Renamed {channel.name} to {new_name}")
                        fixed_count += 1
                
                return True, f"✅ Fixed naming for {fixed_count} channels."
            
            # Removed dangerous channel_organization fix - too risky
            
            return False, "❌ Unknown issue type or fix not applicable."
            
        except discord.Forbidden as e:
            logging.error(f"Permission denied while applying fix: {e}")
            return False, f"❌ Permission denied: {e}"
        except Exception as e:
            logging.error(f"Failed to apply fix: {e}")
            return False, f"❌ Failed to apply fix: {e}"



    @app_commands.command(name="test-permissions", description="Test bot permissions by creating a test channel")
    @is_admin()
    async def test_permissions(self, interaction: discord.Interaction):
        await interaction.response.defer(thinking=True, ephemeral=True)
        
        assert interaction.guild is not None
        guild = interaction.guild
        
        try:
            # Test channel creation
            test_channel = await guild.create_text_channel("bot-permission-test")
            await asyncio.sleep(1)
            
            # Test channel modification
            await test_channel.edit(name="bot-test-renamed")
            await asyncio.sleep(1)
            
            # Test permission modification
            await test_channel.set_permissions(guild.default_role, read_messages=False)
            await asyncio.sleep(1)
            
            # Test channel deletion
            await test_channel.delete()
            
            await interaction.followup.send("✅ **Permission Test PASSED** - Bot can create, modify, and delete channels!", ephemeral=True)
            
        except discord.Forbidden as e:
            await interaction.followup.send(f"❌ **Permission Test FAILED** - {e}", ephemeral=True)
        except Exception as e:
            await interaction.followup.send(f"❌ **Test Error** - {e}", ephemeral=True)

    @app_commands.command(name="fix-bot-permissions", description="Automatically fix bot role hierarchy and permissions")
    @is_admin()
    async def fix_bot_permissions(self, interaction: discord.Interaction):
        await interaction.response.defer(thinking=True, ephemeral=True)
        
        assert interaction.guild is not None
        guild = interaction.guild
        
        success = await CoreHelper.ensure_bot_permissions(guild)
        
        if success:
            await interaction.followup.send(
                "✅ **Bot permissions fixed!**\n"
                "🔧 Created/updated admin role with full permissions\n"
                "📈 Elevated bot role in hierarchy\n"
                "🛡️ Bot now has proper access to manage your server",
                ephemeral=True
            )
        else:
            await interaction.followup.send(
                "❌ **Failed to fix bot permissions**\n"
                "🔐 The bot lacks the permissions needed to create/modify roles\n"
                "👤 Please manually give the bot 'Manage Roles' permission or Administrator access\n"
                "⚙️ Go to: Server Settings → Roles → [Bot Role] → Enable needed permissions",
                ephemeral=True
            )

    # Analytics commands removed for privacy protection
    # Bot is purely for user service, not for inspecting other users' data

async def main():
    """Main function to run the bot"""
    global bot_instance
    
    try:
        # Create bot instance
        bot = ProfessionalBuilderBot()
        bot_instance = bot
        
        # Check if we have required connections
        if not supabase:
            logging.warning("⚠️ No Supabase connection - subscription features will be disabled")
        
        if not OPENAI_API_KEY:
            logging.warning("⚠️ No OpenAI API key - AI features will be disabled")
        
        logging.info("🚀 Starting BuildForMe Bot...")
        
        # Run the bot
        async with bot:
            await bot.start(DISCORD_TOKEN)
            
    except discord.LoginFailure:
        logging.error("❌ Invalid Discord token")
    except KeyboardInterrupt:
        logging.info("🔄 Received keyboard interrupt, shutting down...")
    except Exception as e:
        logging.error(f"❌ Fatal error: {e}")
    finally:
        if bot_instance:
            try:
                await bot_instance.close()
            except:
                pass
        logging.info("✅ Bot shutdown complete")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logging.info("🔄 Keyboard interrupt received")
    except Exception as e:
        logging.error(f"❌ Failed to start bot: {e}")
    finally:
        logging.info("👋 Goodbye!")