#!/bin/bash

# BuildForMe Discord Bot Startup Script
# This script starts the bot with proper error handling and logging

echo "🚀 Starting BuildForMe Discord Bot..."

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed or not in PATH"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please create a .env file with the following variables:"
    echo "DISCORD_TOKEN=your_discord_bot_token"
    echo "OPENAI_API_KEY=your_openai_api_key"
    echo "SUPABASE_URL=your_supabase_url"
    echo "SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key"
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Start the bot with logging
echo "🤖 Starting bot..."
python3 professional_builder_bot.py 2>&1 | tee logs/bot_$(date +%Y%m%d_%H%M%S).log

echo "👋 Bot stopped." 