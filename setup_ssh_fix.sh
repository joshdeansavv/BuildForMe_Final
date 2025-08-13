#!/bin/bash

# SSH Connection Fix Setup Script
# This script configures your environment to prevent SSH connection interference

echo "Setting up SSH connection fixes..."

# Create SSH control directory
mkdir -p ~/.ssh/control

# Backup existing shell profile
if [ -f ~/.zshrc ]; then
    cp ~/.zshrc ~/.zshrc.backup.$(date +%Y%m%d_%H%M%S)
    echo "Backed up ~/.zshrc"
fi

# Add SSH configuration to shell profile
cat >> ~/.zshrc << 'EOF'

# SSH Connection Management
# Prevent SSH connections from interfering with each other
export SSH_AUTH_SOCK=$(find /tmp -name "agent.*" -user $USER 2>/dev/null | head -1)
if [ -z "$SSH_AUTH_SOCK" ]; then
    eval $(ssh-agent -s) > /dev/null 2>&1
fi

# SSH connection helper functions
ssh_connect() {
    local host=$1
    local user=${2:-$USER}
    local port=${3:-22}
    
    # Use unique control socket
    local control_socket="$HOME/.ssh/control/$host-$port-$user"
    
    ssh -o ControlMaster=yes \
        -o ControlPath="$control_socket" \
        -o ControlPersist=10m \
        -o ServerAliveInterval=60 \
        -o ServerAliveCountMax=3 \
        -o TCPKeepAlive=yes \
        -o Multiplexing=yes \
        -p "$port" \
        "$user@$host"
}

ssh_list() {
    echo "Active SSH connections:"
    ps aux | grep "ssh.*-o ControlMaster" | grep -v grep || echo "No active connections found"
    
    echo -e "\nControl sockets:"
    ls -la ~/.ssh/control/ 2>/dev/null || echo "No control sockets found"
}

ssh_close() {
    local host=$1
    local user=${2:-$USER}
    local port=${3:-22}
    
    local control_socket="$HOME/.ssh/control/$host-$port-$user"
    
    if [ -S "$control_socket" ]; then
        echo "Closing connection to $host..."
        ssh -O exit -o ControlPath="$control_socket" "$user@$host" 2>/dev/null
        rm -f "$control_socket"
    else
        echo "No active connection found for $host"
    fi
}

ssh_close_all() {
    echo "Closing all SSH connections..."
    for socket in ~/.ssh/control/*; do
        if [ -S "$socket" ]; then
            ssh -O exit -o ControlPath="$socket" dummy 2>/dev/null
            rm -f "$socket"
        fi
    done
    echo "All connections closed"
}

EOF

echo "Added SSH management functions to ~/.zshrc"
echo ""
echo "New functions available:"
echo "  ssh_connect <host> [user] [port]  - Start a new SSH connection"
echo "  ssh_list                          - List active connections"
echo "  ssh_close <host> [user] [port]    - Close a specific connection"
echo "  ssh_close_all                     - Close all connections"
echo ""
echo "To apply changes, run: source ~/.zshrc"
echo ""
echo "Setup complete! Your SSH connections should now be more stable." 