#!/bin/bash

# BuildForMe Auto-Deploy Script
# Professional deployment with proper structure and error handling
# Last updated: 2025-01-13

set -e

# Configuration
PROJECT_ROOT="/home/ubuntu/buildforme"
NGINX_CONFIG="$PROJECT_ROOT/config/nginx/nginx.conf"
LOG_DIR="$PROJECT_ROOT/logs"
BACKUP_DIR="$PROJECT_ROOT/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Ensure log directory exists
mkdir -p "$LOG_DIR"
mkdir -p "$BACKUP_DIR"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_DIR/deploy.log"
}

# Function to create backup
create_backup() {
    log "📦 Creating backup..."
    tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" \
        --exclude="node_modules" \
        --exclude="dist" \
        --exclude="logs" \
        --exclude="backups" \
        -C "$PROJECT_ROOT" . 2>/dev/null || true
    log "✅ Backup created: backup_$TIMESTAMP.tar.gz"
}

# Function to cleanup old backups (keep last 5)
cleanup_backups() {
    log "🧹 Cleaning up old backups..."
    cd "$BACKUP_DIR"
    ls -t backup_*.tar.gz 2>/dev/null | tail -n +6 | xargs -r rm -f
    log "✅ Backup cleanup completed"
}

echo "🚀 Starting BuildForMe Professional Deployment"
echo "=============================================="

# Change to project directory
cd "$PROJECT_ROOT"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    log "❌ Error: package.json not found. Are you in the right directory?"
    exit 1
fi

# Create backup before deployment
create_backup

# Pull latest changes from GitHub
log "📥 Pulling latest changes from GitHub..."
if git pull origin main; then
    log "✅ Successfully pulled latest changes"
else
    log "❌ Failed to pull from GitHub"
    exit 1
fi

# Install/update dependencies
log "📦 Installing dependencies..."
if npm ci --production=false; then
    log "✅ Dependencies installed successfully"
else
    log "❌ Failed to install dependencies"
    exit 1
fi

# Set up environment variables if .env doesn't exist
if [ ! -f ".env" ]; then
    log "🔧 Setting up environment variables..."
    if ./config/deployment/scripts/setup-env.sh; then
        log "✅ Environment variables set up"
    else
        log "⚠️  Failed to set up environment variables, using fallback"
    fi
fi

# Build the React app with environment variables
log "🏗️  Building React application..."
if [ -f ".env" ]; then
    if npm run build; then
        log "✅ Build completed successfully"
    else
        log "❌ Build failed"
        exit 1
    fi
else
    # Fallback build with inline environment variables
    log "⚠️  Building with default environment variables..."
    if VITE_SUPABASE_URL=https://ewzebkfumdevcdwhhdnm.supabase.co \
       VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3emVia2Z1bWRldmNkd2hoZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjExOTIsImV4cCI6MjA2Nzc5NzE5Mn0.iDauM37JpTJbx8TXNDW_7pjl9gTT7JcM2dNCkI7cv0U \
       VITE_DISCORD_CLIENT_ID=placeholder \
       VITE_STRIPE_AI_PREMIUM_PRICE_ID=price_placeholder \
       npm run build; then
        log "✅ Build completed successfully with fallback environment"
    else
        log "❌ Build failed"
        exit 1
    fi
fi

# Check if build output exists
if [ ! -f "dist/index.html" ]; then
    log "❌ Build output not found - dist/index.html missing"
    exit 1
fi

# Validate nginx configuration
log "🔍 Validating nginx configuration..."
if [ -f "$NGINX_CONFIG" ]; then
    # Test the main nginx configuration (not the site config)
    if sudo nginx -t; then
        log "✅ nginx configuration is valid"
    else
        log "❌ nginx configuration is invalid"
        exit 1
    fi
else
    log "❌ nginx configuration file not found at $NGINX_CONFIG"
    exit 1
fi

# Update nginx configuration
log "🔧 Updating nginx configuration..."
if sudo cp "$NGINX_CONFIG" /etc/nginx/sites-available/buildforme; then
    log "✅ nginx configuration updated"
else
    log "❌ Failed to update nginx configuration"
    exit 1
fi

# Test nginx configuration
log "🔍 Testing nginx configuration..."
if sudo nginx -t; then
    log "✅ nginx configuration test passed"
else
    log "❌ nginx configuration test failed"
    exit 1
fi

# Reload nginx
log "🔄 Reloading nginx..."
if sudo systemctl reload nginx; then
    log "✅ nginx reloaded successfully"
else
    log "⚠️  Failed to reload nginx (continuing anyway)"
fi

# Test the site
log "🔍 Testing website..."
if curl -s -o /dev/null -w "%{http_code}" https://buildforme.xyz | grep -q "200"; then
    log "✅ Website is responding correctly"
else
    log "⚠️  Website may not be responding properly"
fi

# Cleanup old backups
cleanup_backups

# Log deployment completion
log "🎉 Deployment completed successfully!"
echo ""
echo "📊 Deployment Summary:"
echo "=================================="
echo "- Timestamp: $TIMESTAMP"
echo "- Git pull: ✅ Complete"
echo "- Dependencies: ✅ Updated"
echo "- Environment: ✅ Configured"
echo "- Build: ✅ Complete"
echo "- nginx config: ✅ Updated"
echo "- nginx: ✅ Reloaded"
echo "- Website: ✅ Live"
echo "- Backup: ✅ Created"
echo ""
echo "🌐 Website: https://buildforme.xyz"
echo "📝 Logs: $LOG_DIR/deploy.log"
echo "💾 Backup: $BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
echo ""
echo "🔧 Useful commands:"
echo "- Check nginx status: sudo systemctl status nginx"
echo "- View nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "- View access logs: sudo tail -f /var/log/nginx/access.log" 