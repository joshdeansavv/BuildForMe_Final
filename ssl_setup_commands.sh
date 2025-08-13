#!/bin/bash

# SSL Certificate Setup for buildforme.xyz
# Run this AFTER DNS has been updated and propagated

echo "🔐 Setting up SSL certificates for buildforme.xyz..."

# Get SSL certificates for the domain
sudo certbot --nginx -d buildforme.xyz -d www.buildforme.xyz --non-interactive --agree-tos --email admin@buildforme.xyz

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

echo "✅ SSL certificates installed and nginx reloaded"
echo "🌐 Test the site:"
echo "  - https://buildforme.xyz"
echo "  - https://www.buildforme.xyz" 