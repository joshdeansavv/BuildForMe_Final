# BuildForMe - Professional Website Setup

## Overview
This is a professional React TypeScript application with Tailwind CSS for the BuildForMe Discord Bot Dashboard. The application is deployed on a self-hosted cloud server with nginx as the web server.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI components
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Payment**: Stripe integration
- **Web Server**: nginx with HTTP/2, SSL/TLS, and security headers
- **Deployment**: Automated deployment with environment management

## Directory Structure
```
/home/ubuntu/buildforme/
├── config/
│   ├── nginx/
│   │   └── nginx.conf           # Main nginx configuration
│   ├── ssl/                     # SSL certificates and configs
│   └── deployment/
│       ├── scripts/             # Deployment scripts
│       ├── auto-deploy.sh       # Automated deployment
│       ├── deploy.sh            # Manual deployment
│       └── setup-env.sh         # Environment setup
├── src/                         # React application source code
├── dist/                        # Built application (served by nginx)
├── public/                      # Static assets
├── logs/                        # Application logs
├── backups/                     # Configuration backups
├── docs/                        # Documentation
└── node_modules/                # Dependencies
```

## Security Features
- **HTTPS Only**: All HTTP traffic redirected to HTTPS
- **HTTP/2**: Modern protocol for better performance
- **Security Headers**: HSTS, CSP, X-Frame-Options, etc.
- **Rate Limiting**: Protection against abuse
- **SSL/TLS**: Modern ciphers and protocols only
- **OCSP Stapling**: Improved certificate validation
- **File Access Control**: Hidden files and backups blocked

## Performance Optimizations
- **Gzip Compression**: Reduced bandwidth usage
- **Static Asset Caching**: Aggressive caching for static files
- **HTTP/2 Server Push**: Faster resource loading
- **Optimized SSL**: Session caching and modern ciphers

## Deployment
1. **Environment Setup**: Run `./config/deployment/scripts/setup-env.sh`
2. **Build Application**: `npm run build`
3. **Deploy**: `./config/deployment/scripts/auto-deploy.sh`

## Monitoring
- **nginx Access Logs**: `/var/log/nginx/access.log`
- **nginx Error Logs**: `/var/log/nginx/error.log`
- **Application Logs**: `./logs/`

## Maintenance
- **SSL Certificate Renewal**: Automated via certbot
- **Security Updates**: Regular nginx and system updates
- **Backup**: Regular configuration and data backups
- **Monitoring**: Health checks and performance monitoring

## Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Test build locally
npm run preview
```

## Environment Variables
See `env_template.txt` for required environment variables.

## Support
For technical support, contact the development team or refer to the documentation in the `docs/` directory. 