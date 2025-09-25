#!/bin/bash

# Restore Normal Caching Script for BuildForMe
# This restores the original nginx caching configuration

echo "🔄 Restoring normal caching for BuildForMe..."

# Check if backup exists
if [ ! -f "/etc/nginx/sites-available/buildforme.backup" ]; then
    echo "❌ No backup found! Cannot restore original configuration."
    exit 1
fi

# Restore original config
sudo cp /etc/nginx/sites-available/buildforme.backup /etc/nginx/sites-available/buildforme

# Test and reload nginx
echo "🔍 Testing nginx configuration..."
if sudo nginx -t; then
    echo "✅ Configuration valid, reloading nginx..."
    sudo systemctl reload nginx
    echo "🎉 Normal caching restored!"
    echo ""
    echo "📊 Caching Status:"
    echo "  - Static assets: 1 year cache"
    echo "  - HTML files: ETag validation"
    echo ""
    echo "🌐 Site: https://buildforme.xyz"
    
    # Clean up backup
    sudo rm /etc/nginx/sites-available/buildforme.backup
    echo "🧹 Backup file cleaned up"
else
    echo "❌ Configuration invalid! Please check manually."
    echo "🔧 Original config is in: /etc/nginx/sites-available/buildforme.backup"
fi 