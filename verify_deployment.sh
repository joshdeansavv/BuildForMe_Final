#!/bin/bash

# BuildForMe Deployment Verification Script
# Checks the status of buildforme.xyz deployment

echo "🔍 Verifying BuildForMe deployment for buildforme.xyz..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DOMAIN="buildforme.xyz"
WWW_DOMAIN="www.buildforme.xyz"
IP="216.237.252.92"

echo -e "${BLUE}📋 Checking configuration for:${NC}"
echo -e "  Domain: ${DOMAIN}"
echo -e "  IP: ${IP}"
echo ""

# Check DNS resolution
echo -e "${YELLOW}🌐 DNS Resolution Check:${NC}"
DNS_IP=$(dig +short $DOMAIN A | head -1)
if [ "$DNS_IP" = "$IP" ]; then
    echo -e "${GREEN}✅ DNS A record for $DOMAIN points to $IP${NC}"
else
    echo -e "${RED}❌ DNS A record for $DOMAIN points to $DNS_IP (expected $IP)${NC}"
fi

WWW_DNS_IP=$(dig +short $WWW_DOMAIN A | head -1)
if [ "$WWW_DNS_IP" = "$IP" ]; then
    echo -e "${GREEN}✅ DNS A record for $WWW_DOMAIN points to $IP${NC}"
else
    echo -e "${RED}❌ DNS A record for $WWW_DOMAIN points to $WWW_DNS_IP (expected $IP)${NC}"
fi

echo ""

# Check HTTP connectivity
echo -e "${YELLOW}🌍 HTTP Connectivity Check:${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -L --connect-timeout 10 "http://$DOMAIN" 2>/dev/null || echo "000")
if [[ "$HTTP_CODE" == "200" ]]; then
    echo -e "${GREEN}✅ HTTP access working (code: $HTTP_CODE)${NC}"
elif [[ "$HTTP_CODE" == "301" || "$HTTP_CODE" == "302" ]]; then
    echo -e "${GREEN}✅ HTTP redirecting properly (code: $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ HTTP access failed (code: $HTTP_CODE)${NC}"
fi

# Check HTTPS connectivity
echo -e "${YELLOW}🔐 HTTPS Connectivity Check:${NC}"
HTTPS_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "https://$DOMAIN" 2>/dev/null || echo "000")
if [[ "$HTTPS_CODE" == "200" ]]; then
    echo -e "${GREEN}✅ HTTPS access working (code: $HTTPS_CODE)${NC}"
else
    echo -e "${RED}❌ HTTPS access failed (code: $HTTPS_CODE)${NC}"
fi

echo ""

# Check SSL certificate
echo -e "${YELLOW}📜 SSL Certificate Check:${NC}"
SSL_INFO=$(openssl s_client -connect $DOMAIN:443 -servername $DOMAIN < /dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates 2>/dev/null || echo "SSL check failed")
if [[ "$SSL_INFO" != "SSL check failed" ]]; then
    echo -e "${GREEN}✅ SSL certificate found${NC}"
    echo "$SSL_INFO" | while IFS= read -r line; do
        echo "  $line"
    done
else
    echo -e "${RED}❌ SSL certificate check failed${NC}"
fi

echo ""

# Check server response headers
echo -e "${YELLOW}📊 Server Headers Check:${NC}"
HEADERS=$(curl -s -I "https://$DOMAIN" --connect-timeout 10 2>/dev/null | head -10)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Server responding with headers:${NC}"
    echo "$HEADERS" | while IFS= read -r line; do
        echo "  $line"
    done
else
    echo -e "${RED}❌ Failed to get server headers${NC}"
fi

echo ""

# Check if this is being run on the server
if [ -f "/etc/nginx/sites-available/buildforme.xyz" ]; then
    echo -e "${YELLOW}⚙️  Server Configuration Check (Local):${NC}"
    
    # Check nginx configuration
    if nginx -t &>/dev/null; then
        echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
    else
        echo -e "${RED}❌ Nginx configuration has errors${NC}"
    fi
    
    # Check nginx service
    if systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✅ Nginx service is running${NC}"
    else
        echo -e "${RED}❌ Nginx service is not running${NC}"
    fi
    
    # Check SSL certificates on server
    if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
        echo -e "${GREEN}✅ SSL certificate files found on server${NC}"
        CERT_EXPIRY=$(openssl x509 -enddate -noout -in "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" 2>/dev/null | cut -d= -f2)
        if [ $? -eq 0 ]; then
            echo -e "  Certificate expires: $CERT_EXPIRY"
        fi
    else
        echo -e "${RED}❌ SSL certificate files not found on server${NC}"
    fi
    
    # Check production directory
    if [ -d "/var/www/buildforme.xyz" ] && [ "$(ls -A /var/www/buildforme.xyz)" ]; then
        echo -e "${GREEN}✅ Production directory exists and has content${NC}"
        FILE_COUNT=$(find /var/www/buildforme.xyz -type f | wc -l)
        echo -e "  Files in production: $FILE_COUNT"
    else
        echo -e "${RED}❌ Production directory empty or missing${NC}"
    fi
else
    echo -e "${BLUE}ℹ️  Run this script on the server (216.237.252.92) for detailed configuration check${NC}"
fi

echo ""
echo -e "${BLUE}📝 Summary:${NC}"
echo -e "  Domain: $DOMAIN"
echo -e "  IP Address: $IP"
echo -e "  HTTP Status: $HTTP_CODE"
echo -e "  HTTPS Status: $HTTPS_CODE"

if [[ "$HTTP_CODE" == "200" || "$HTTP_CODE" == "301" || "$HTTP_CODE" == "302" ]] && [[ "$HTTPS_CODE" == "200" ]]; then
    echo -e "${GREEN}🎉 Website appears to be working correctly!${NC}"
else
    echo -e "${YELLOW}⚠️  Some issues detected. Check the details above.${NC}"
fi 