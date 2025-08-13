#!/bin/bash

# BuildForMe Production Deployment Script
# This script builds the React app and deploys it to the production nginx server

set -e  # Exit on any error

echo "🚀 Starting BuildForMe production deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/home/joshua/MASTER"
PROD_DIR="/var/www/buildforme.xyz"
BACKUP_DIR="/var/www/buildforme.xyz.backup.$(date +%Y%m%d_%H%M%S)"

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

echo -e "${YELLOW}💾 Creating backup of current production files...${NC}"
sudo cp -r "$PROD_DIR" "$BACKUP_DIR"

echo -e "${YELLOW}🗑️  Clearing production directory...${NC}"
sudo rm -rf "$PROD_DIR"/*

echo -e "${YELLOW}📤 Copying new build to production...${NC}"
sudo cp -r dist/* "$PROD_DIR/"

echo -e "${YELLOW}🔐 Setting proper permissions...${NC}"
sudo chown -R www-data:www-data "$PROD_DIR/"
sudo chmod -R 755 "$PROD_DIR/"

echo -e "${YELLOW}🔄 Reloading nginx...${NC}"
sudo systemctl reload nginx

# Test the deployment
echo -e "${YELLOW}🧪 Testing deployment...${NC}"
if curl -s -o /dev/null -w "%{http_code}" https://buildforme.xyz | grep -q "200"; then
    echo -e "${GREEN}✅ Deployment successful! Website is accessible.${NC}"
else
    echo -e "${RED}❌ Deployment may have failed. Please check the website.${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${YELLOW}📝 Backup created at: $BACKUP_DIR${NC}"
echo -e "${YELLOW}🌐 Website: https://buildforme.xyz${NC}" 