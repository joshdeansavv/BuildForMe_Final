# BuildForMe Deployment Guide

## Overview
This document outlines the professional deployment process for the BuildForMe Discord Bot Dashboard.

## Prerequisites
- Ubuntu 20.04+ server with sudo access
- Domain name pointing to server IP
- SSL certificate (Let's Encrypt recommended)
- Node.js 18+ and npm
- nginx web server

## Initial Setup

### 1. Server Preparation
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx certbot python3-certbot-nginx nodejs npm git curl

# Install PM2 for process management (optional)
sudo npm install -g pm2
```

### 2. SSL Certificate Setup
```bash
# Obtain SSL certificate
sudo certbot --nginx -d buildforme.xyz -d www.buildforme.xyz

# Verify certificate
sudo certbot certificates
```

### 3. Environment Configuration
```bash
# Navigate to project directory
cd /home/ubuntu/buildforme

# Set up environment variables
./config/deployment/scripts/setup-env.sh

# Configure environment variables in .env file
nano .env
```

## Deployment Process

### Automated Deployment
```bash
# Run the automated deployment script
./config/deployment/scripts/auto-deploy.sh
```

### Manual Deployment
```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm ci

# Build application
npm run build

# Update nginx configuration
sudo cp config/nginx/nginx.conf /etc/nginx/sites-available/buildforme

# Test and reload nginx
sudo nginx -t && sudo systemctl reload nginx
```

## Directory Structure
```
/home/ubuntu/buildforme/
├── config/
│   ├── nginx/
│   │   └── nginx.conf           # nginx configuration
│   ├── ssl/                     # SSL certificates
│   └── deployment/
│       └── scripts/             # Deployment scripts
├── src/                         # Source code
├── dist/                        # Built application
├── logs/                        # Application logs
├── backups/                     # Configuration backups
└── docs/                        # Documentation
```

## Configuration Files

### nginx Configuration
- **Location**: `/etc/nginx/sites-available/buildforme`
- **Source**: `config/nginx/nginx.conf`
- **Features**: 
  - HTTP/2 support
  - SSL/TLS with modern ciphers
  - Security headers
  - Rate limiting
  - Static asset caching

### Environment Variables
Required variables in `.env`:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_DISCORD_CLIENT_ID=your_discord_client_id
VITE_STRIPE_AI_PREMIUM_PRICE_ID=your_stripe_price_id
```

## Monitoring

### Health Checks
```bash
# Run comprehensive health check
./config/deployment/scripts/monitor.sh

# Check specific services
sudo systemctl status nginx
sudo systemctl status certbot.timer
```

### Log Files
- **Deployment logs**: `logs/deploy.log`
- **Monitoring logs**: `logs/monitor.log`
- **nginx access logs**: `/var/log/nginx/access.log`
- **nginx error logs**: `/var/log/nginx/error.log`

## Maintenance

### SSL Certificate Renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Manual renewal (if needed)
sudo certbot renew
```

### Backup Management
```bash
# Backups are automatically created during deployment
# Location: backups/backup_YYYYMMDD_HHMMSS.tar.gz

# Manual backup
tar -czf backups/manual_backup_$(date +%Y%m%d_%H%M%S).tar.gz \
    --exclude="node_modules" \
    --exclude="dist" \
    --exclude="logs" \
    --exclude="backups" \
    .
```

### Security Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js dependencies
npm audit fix

# Update nginx configuration if needed
sudo nginx -t && sudo systemctl reload nginx
```

## Troubleshooting

### Common Issues

1. **nginx fails to start**
   ```bash
   sudo nginx -t  # Check configuration
   sudo systemctl status nginx  # Check service status
   ```

2. **SSL certificate issues**
   ```bash
   sudo certbot certificates  # Check certificate status
   sudo certbot renew --dry-run  # Test renewal
   ```

3. **Build failures**
   ```bash
   npm ci  # Reinstall dependencies
   npm run build  # Rebuild application
   ```

4. **Permission issues**
   ```bash
   sudo chown -R ubuntu:ubuntu /home/ubuntu/buildforme
   chmod +x config/deployment/scripts/*.sh
   ```

### Performance Optimization

1. **Enable HTTP/2**
   - Already configured in nginx.conf
   - Verify: `curl -I --http2 https://buildforme.xyz`

2. **Optimize caching**
   - Static assets cached for 1 year
   - HTML files use ETag validation

3. **Monitor performance**
   - Use monitoring script regularly
   - Check response times and resource usage

## Security Considerations

### Implemented Security Features
- HTTPS-only with HSTS
- Modern SSL/TLS configuration
- Security headers (CSP, X-Frame-Options, etc.)
- Rate limiting
- Hidden file protection
- Regular security updates

### Additional Security Measures
- Firewall configuration (ufw)
- Fail2ban for intrusion prevention
- Regular security audits
- Access log monitoring

## Rollback Procedure

### Quick Rollback
```bash
# Restore from backup
cd /home/ubuntu/buildforme
tar -xzf backups/backup_YYYYMMDD_HHMMSS.tar.gz

# Rebuild and deploy
npm ci
npm run build
sudo systemctl reload nginx
```

### Git Rollback
```bash
# Revert to previous commit
git log --oneline  # Find commit hash
git reset --hard <commit-hash>

# Redeploy
./config/deployment/scripts/auto-deploy.sh
```

## Support

For technical support:
- Check logs in `logs/` directory
- Run monitoring script for health check
- Review nginx error logs
- Contact development team with specific error messages 