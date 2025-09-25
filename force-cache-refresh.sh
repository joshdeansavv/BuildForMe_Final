#!/bin/bash

# Force Cache Refresh Script for BuildForMe
# This temporarily modifies nginx headers to force browser cache refresh

echo "🔄 Forcing browser cache refresh for BuildForMe..."

# Backup original nginx config
sudo cp /etc/nginx/sites-available/buildforme /etc/nginx/sites-available/buildforme.backup

# Create temporary config with no-cache headers
sudo sed -i '/# Static assets with aggressive caching/,/}/c\
    # Static assets with NO caching (temporary)\
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|avif)$ {\
        expires -1;\
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";\
        add_header Pragma "no-cache";\
        access_log off;\
    }' /etc/nginx/sites-available/buildforme

# Also make HTML not cache
sudo sed -i '/location \/ {/,/}/c\
    location / {\
        # Try to serve request as file, then directory, then fallback to index.html\
        try_files $uri $uri/ /index.html;\
        \
        # No caching for HTML\
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";\
        add_header Pragma "no-cache";\
        add_header X-Frame-Options "SAMEORIGIN" always;\
        add_header X-Content-Type-Options "nosniff" always;\
    }' /etc/nginx/sites-available/buildforme

# Test and reload nginx
echo "🔍 Testing nginx configuration..."
if sudo nginx -t; then
    echo "✅ Configuration valid, reloading nginx..."
    sudo systemctl reload nginx
    echo "🎉 Cache refresh forced! Users will now get fresh content."
    echo ""
    echo "⚠️  IMPORTANT: Run './restore-caching.sh' in 5-10 minutes to restore normal caching!"
    echo ""
    echo "🌐 Test your site now: https://buildforme.xyz"
else
    echo "❌ Configuration invalid, restoring backup..."
    sudo cp /etc/nginx/sites-available/buildforme.backup /etc/nginx/sites-available/buildforme
    sudo systemctl reload nginx
    echo "🔧 Please check nginx configuration manually."
fi 