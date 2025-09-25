#!/bin/bash

# SSL Certificate Setup for buildforme.com
# Run this AFTER DNS has been updated and propagated

echo "🔐 Setting up SSL certificates for buildforme.com..."

# Get SSL certificates for both domains
sudo certbot --nginx -d buildforme.com -d www.buildforme.com --non-interactive --agree-tos --email admin@buildforme.com

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

echo "✅ SSL certificates installed and nginx reloaded"
echo "🌐 Test the sites:"
echo "  - https://buildforme.com"
echo "  - https://www.buildforme.com"
echo "  - https://buildforme.xyz"
echo "  - https://www.buildforme.xyz" 