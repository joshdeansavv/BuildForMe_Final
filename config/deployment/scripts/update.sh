#!/bin/bash

# BuildForMe Dashboard Update Script
# This script rebuilds and deploys the frontend

set -e

echo "🔄 BuildForMe Dashboard Update Script"
echo "====================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Are you in the right directory?"
    exit 1
fi

echo "📦 Installing/updating dependencies..."
npm install

echo "🏗️  Building production bundle..."
npm run build

echo "🔍 Checking build output..."
if [ ! -f "dist/index.html" ]; then
    echo "❌ Build failed - dist/index.html not found"
    exit 1
fi

echo "🔄 Reloading nginx..."
if command -v nginx &> /dev/null; then
    if systemctl is-active --quiet nginx; then
        sudo systemctl reload nginx
        echo "✅ Nginx reloaded"
    else
        echo "⚠️  Nginx is not running"
    fi
else
    echo "⚠️  Nginx not found - make sure it's installed and configured"
fi

echo ""
echo "✅ Update completed!"
echo "==================="
echo "Your BuildForMe Dashboard has been updated and deployed."
echo ""
echo "🔧 Useful commands:"
echo "- Check nginx status: sudo systemctl status nginx"
echo "- View nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "- Test the site: curl -I https://buildforme.xyz" 