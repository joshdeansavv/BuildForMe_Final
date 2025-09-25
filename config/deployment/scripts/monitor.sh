#!/bin/bash

# BuildForMe Website Monitoring Script
# Professional monitoring and health checks
# Last updated: 2025-01-13

# Configuration
DOMAIN="buildforme.xyz"
LOG_DIR="/home/ubuntu/buildforme/logs"
ALERT_EMAIL="admin@buildforme.xyz"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to log with timestamp
log() {
    echo "[$TIMESTAMP] $1" >> "$LOG_DIR/monitor.log"
}

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    if [ "$status" = "OK" ]; then
        echo -e "${GREEN}✅ $message${NC}"
    elif [ "$status" = "WARNING" ]; then
        echo -e "${YELLOW}⚠️  $message${NC}"
    else
        echo -e "${RED}❌ $message${NC}"
    fi
}

# Function to check website availability
check_website() {
    local url="https://$DOMAIN"
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 10)
    
    if [ "$response" = "200" ]; then
        print_status "OK" "Website is responding (HTTP $response)"
        log "Website check: OK (HTTP $response)"
        return 0
    else
        print_status "ERROR" "Website is not responding properly (HTTP $response)"
        log "Website check: ERROR (HTTP $response)"
        return 1
    fi
}

# Function to check SSL certificate
check_ssl() {
    local expiry=$(echo | openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
    local expiry_epoch=$(date -d "$expiry" +%s)
    local current_epoch=$(date +%s)
    local days_until_expiry=$(( (expiry_epoch - current_epoch) / 86400 ))
    
    if [ $days_until_expiry -gt 30 ]; then
        print_status "OK" "SSL certificate valid for $days_until_expiry days"
        log "SSL check: OK ($days_until_expiry days remaining)"
        return 0
    elif [ $days_until_expiry -gt 7 ]; then
        print_status "WARNING" "SSL certificate expires in $days_until_expiry days"
        log "SSL check: WARNING ($days_until_expiry days remaining)"
        return 1
    else
        print_status "ERROR" "SSL certificate expires in $days_until_expiry days"
        log "SSL check: ERROR ($days_until_expiry days remaining)"
        return 2
    fi
}

# Function to check nginx status
check_nginx() {
    if systemctl is-active --quiet nginx; then
        print_status "OK" "nginx is running"
        log "nginx check: OK"
        return 0
    else
        print_status "ERROR" "nginx is not running"
        log "nginx check: ERROR"
        return 1
    fi
}

# Function to check disk usage
check_disk() {
    local usage=$(df -h /home/ubuntu/buildforme | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ $usage -lt 80 ]; then
        print_status "OK" "Disk usage: ${usage}%"
        log "Disk check: OK (${usage}%)"
        return 0
    elif [ $usage -lt 90 ]; then
        print_status "WARNING" "Disk usage: ${usage}%"
        log "Disk check: WARNING (${usage}%)"
        return 1
    else
        print_status "ERROR" "Disk usage: ${usage}%"
        log "Disk check: ERROR (${usage}%)"
        return 2
    fi
}

# Function to check response time
check_response_time() {
    local response_time=$(curl -s -o /dev/null -w "%{time_total}" "https://$DOMAIN" --max-time 10)
    local response_ms=$(echo "$response_time * 1000" | bc)
    
    if (( $(echo "$response_time < 2.0" | bc -l) )); then
        print_status "OK" "Response time: ${response_ms}ms"
        log "Response time check: OK (${response_ms}ms)"
        return 0
    elif (( $(echo "$response_time < 5.0" | bc -l) )); then
        print_status "WARNING" "Response time: ${response_ms}ms"
        log "Response time check: WARNING (${response_ms}ms)"
        return 1
    else
        print_status "ERROR" "Response time: ${response_ms}ms"
        log "Response time check: ERROR (${response_ms}ms)"
        return 2
    fi
}

# Function to check security headers
check_security_headers() {
    local headers=$(curl -s -I "https://$DOMAIN" | grep -i "strict-transport-security\|x-frame-options\|x-content-type-options")
    
    if [ -n "$headers" ]; then
        print_status "OK" "Security headers are present"
        log "Security headers check: OK"
        return 0
    else
        print_status "ERROR" "Security headers are missing"
        log "Security headers check: ERROR"
        return 1
    fi
}

# Main monitoring function
main() {
    echo "🔍 BuildForMe Website Health Check"
    echo "=================================="
    echo "Domain: $DOMAIN"
    echo "Time: $TIMESTAMP"
    echo ""
    
    local overall_status=0
    
    # Run all checks
    check_website || overall_status=1
    check_ssl || overall_status=1
    check_nginx || overall_status=1
    check_disk || overall_status=1
    check_response_time || overall_status=1
    check_security_headers || overall_status=1
    
    echo ""
    if [ $overall_status -eq 0 ]; then
        print_status "OK" "All checks passed"
        log "Overall status: OK"
    else
        print_status "ERROR" "Some checks failed"
        log "Overall status: ERROR"
    fi
    
    echo ""
    echo "📝 Detailed logs: $LOG_DIR/monitor.log"
    
    return $overall_status
}

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Run monitoring
main "$@" 