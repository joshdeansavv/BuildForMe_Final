#!/bin/bash

# BuildForMe Discord Bot Dashboard Deployment Script
# This script sets up nginx and SSL for your domain

set -e

echo "🚀 BuildForMe Dashboard Deployment Script"
echo "=========================================="

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo "❌ This script must be run as root (use sudo)"
   exit 1
fi

# Variables
DOMAIN="buildforme.xyz"
PROJECT_PATH="/home/ubuntu/buildforme"
NGINX_CONF="/etc/nginx/sites-available/buildforme"
NGINX_ENABLED="/etc/nginx/sites-enabled/buildforme"

echo "📦 Installing required packages..."
apt update
apt install -y nginx certbot python3-certbot-nginx ufw

echo "🔧 Setting up nginx configuration..."
# Copy nginx config
cp "${PROJECT_PATH}/nginx.conf" "${NGINX_CONF}"

# Enable the site
ln -sf "${NGINX_CONF}" "${NGINX_ENABLED}"

# Remove default nginx site if it exists
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    rm "/etc/nginx/sites-enabled/default"
fi

echo "🔒 Setting up firewall..."
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable

echo "🔍 Testing nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors"
    exit 1
fi

echo "🔄 Restarting nginx..."
systemctl restart nginx
systemctl enable nginx

echo "🔐 Setting up SSL certificate with Let's Encrypt..."
echo "Note: Make sure your domain ${DOMAIN} points to this server's IP address"
read -p "Press Enter to continue with SSL setup, or Ctrl+C to cancel..."

# Get SSL certificate
certbot --nginx -d "${DOMAIN}" -d "www.${DOMAIN}" --non-interactive --agree-tos --email admin@${DOMAIN}

if [ $? -eq 0 ]; then
    echo "✅ SSL certificate installed successfully"
else
    echo "⚠️  SSL certificate installation failed. You can run it manually later:"
    echo "sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
fi

echo "🔄 Final nginx restart..."
systemctl restart nginx

echo ""
echo "✅ Deployment completed!"
echo "=========================================="
echo "Your BuildForMe Dashboard should now be available at:"
echo "🌐 https://${DOMAIN}"
echo "🌐 https://www.${DOMAIN}"
echo ""
echo "📋 Next steps:"
echo "1. Verify your domain DNS points to this server"
echo "2. Test the website in your browser"
echo "3. Check nginx logs if needed: sudo tail -f /var/log/nginx/error.log"
echo "4. Set up automatic SSL renewal: sudo crontab -e"
echo "   Add: 0 12 * * * /usr/bin/certbot renew --quiet"
echo ""
echo "🔧 Useful commands:"
echo "- Check nginx status: sudo systemctl status nginx"
echo "- Reload nginx: sudo systemctl reload nginx"
echo "- Check SSL status: sudo certbot status"
echo "- Test SSL renewal: sudo certbot renew --dry-run" 