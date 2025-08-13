#!/bin/bash

# BuildForMe Production Deployment Script for buildforme.xyz
# This script handles complete deployment including SSL setup
# IP: 216.237.252.92
# Domain: buildforme.xyz

set -e  # Exit on any error

echo "🚀 Starting BuildForMe production deployment for buildforme.xyz..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/home/joshua/MASTER"
PROD_DIR="/var/www/buildforme.xyz"
BACKUP_DIR="/var/www/buildforme.xyz.backup.$(date +%Y%m%d_%H%M%S)"
NGINX_CONFIG="/etc/nginx/sites-available/buildforme.xyz"
DOMAIN="buildforme.xyz"
WWW_DOMAIN="www.buildforme.xyz"

echo -e "${BLUE}📋 Configuration:${NC}"
echo -e "  Domain: ${DOMAIN}"
echo -e "  Project Dir: ${PROJECT_DIR}"
echo -e "  Production Dir: ${PROD_DIR}"
echo -e "  IP: 216.237.252.92"

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
    SUDO=""
else
    SUDO="sudo"
fi

echo -e "${YELLOW}📦 Building React application...${NC}"
cd "$PROJECT_DIR"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the application
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"

# Create production directory if it doesn't exist
echo -e "${YELLOW}📁 Setting up production directory...${NC}"
$SUDO mkdir -p "$PROD_DIR"

# Backup existing files if they exist
if [ -d "$PROD_DIR" ] && [ "$(ls -A $PROD_DIR)" ]; then
    echo -e "${YELLOW}💾 Creating backup of current production files...${NC}"
    $SUDO cp -r "$PROD_DIR" "$BACKUP_DIR"
    echo -e "${YELLOW}🗑️  Clearing production directory...${NC}"
    $SUDO rm -rf "$PROD_DIR"/*
fi

echo -e "${YELLOW}📤 Copying new build to production...${NC}"
$SUDO cp -r dist/* "$PROD_DIR/"

echo -e "${YELLOW}🔐 Setting proper permissions...${NC}"
$SUDO chown -R www-data:www-data "$PROD_DIR/"
$SUDO chmod -R 755 "$PROD_DIR/"

# Copy nginx configuration
echo -e "${YELLOW}⚙️  Setting up nginx configuration...${NC}"
$SUDO cp config/nginx/nginx.conf "$NGINX_CONFIG"

# Create symbolic link if it doesn't exist
if [ ! -L "/etc/nginx/sites-enabled/buildforme.xyz" ]; then
    $SUDO ln -sf "$NGINX_CONFIG" /etc/nginx/sites-enabled/buildforme.xyz
fi

# Test nginx configuration
echo -e "${YELLOW}🧪 Testing nginx configuration...${NC}"
$SUDO nginx -t

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Nginx configuration test failed!${NC}"
    exit 1
fi

# Reload nginx
echo -e "${YELLOW}🔄 Reloading nginx...${NC}"
$SUDO systemctl reload nginx

# Set up SSL certificates
echo -e "${YELLOW}🔐 Setting up SSL certificates...${NC}"
echo "Getting SSL certificates for $DOMAIN and $WWW_DOMAIN..."

# Run certbot to get SSL certificates
$SUDO certbot --nginx -d "$DOMAIN" -d "$WWW_DOMAIN" --non-interactive --agree-tos --email admin@buildforme.xyz

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SSL certificates installed successfully!${NC}"
else
    echo -e "${YELLOW}⚠️  SSL certificate installation had issues. Trying alternative method...${NC}"
    # Try standalone method if nginx method fails
    $SUDO systemctl stop nginx
    $SUDO certbot certonly --standalone -d "$DOMAIN" -d "$WWW_DOMAIN" --non-interactive --agree-tos --email admin@buildforme.xyz
    $SUDO systemctl start nginx
fi

# Final nginx reload after SSL
echo -e "${YELLOW}🔄 Final nginx reload...${NC}"
$SUDO systemctl reload nginx

# Test the deployment
echo -e "${YELLOW}🧪 Testing deployment...${NC}"
echo "Testing HTTP to HTTPS redirect..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -L "http://$DOMAIN")
if [[ "$HTTP_CODE" == "200" ]]; then
    echo -e "${GREEN}✅ HTTP redirect working!${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP test returned code: $HTTP_CODE${NC}"
fi

echo "Testing HTTPS access..."
HTTPS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN")
if [[ "$HTTPS_CODE" == "200" ]]; then
    echo -e "${GREEN}✅ HTTPS access working!${NC}"
else
    echo -e "${YELLOW}⚠️  HTTPS test returned code: $HTTPS_CODE${NC}"
fi

# Display final status
echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo -e "${BLUE}📝 Summary:${NC}"
if [ -d "$BACKUP_DIR" ]; then
    echo -e "  Backup created at: $BACKUP_DIR"
fi
echo -e "  Domain: https://$DOMAIN"
echo -e "  WWW Domain: https://$WWW_DOMAIN"
echo -e "  Production Directory: $PROD_DIR"
echo -e "  IP Address: 216.237.252.92"

echo -e "${BLUE}🌐 Test your website:${NC}"
echo -e "  - https://$DOMAIN"
echo -e "  - https://$WWW_DOMAIN"
echo -e "  - http://$DOMAIN (should redirect to HTTPS)"

echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "  1. Verify DNS A records point to 216.237.252.92"
echo -e "  2. Test website functionality"
echo -e "  3. Monitor SSL certificate expiration"
echo -e "  4. Set up automated SSL renewal (certbot renew)"

echo -e "${GREEN}✨ BuildForMe is now live at https://$DOMAIN!${NC}" 