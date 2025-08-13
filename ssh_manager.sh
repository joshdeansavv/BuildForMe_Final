#!/bin/bash

# SSH Connection Manager Script
# This script helps manage multiple SSH connections without interference

SSH_CONTROL_DIR="$HOME/.ssh/control"
mkdir -p "$SSH_CONTROL_DIR"

# Function to start a new SSH connection
start_ssh() {
    local host=$1
    local user=${2:-$USER}
    local port=${3:-22}
    
    echo "Starting SSH connection to $host..."
    
    # Use unique control socket for each connection
    local control_socket="$SSH_CONTROL_DIR/$host-$port-$user"
    
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

# Function to list active connections
list_connections() {
    echo "Active SSH connections:"
    ps aux | grep "ssh.*-o ControlMaster" | grep -v grep || echo "No active connections found"
    
    echo -e "\nControl sockets:"
    ls -la "$SSH_CONTROL_DIR" 2>/dev/null || echo "No control sockets found"
}

# Function to close a specific connection
close_connection() {
    local host=$1
    local user=${2:-$USER}
    local port=${3:-22}
    
    local control_socket="$SSH_CONTROL_DIR/$host-$port-$user"
    
    if [ -S "$control_socket" ]; then
        echo "Closing connection to $host..."
        ssh -O exit -o ControlPath="$control_socket" "$user@$host" 2>/dev/null
        rm -f "$control_socket"
    else
        echo "No active connection found for $host"
    fi
}

# Function to close all connections
close_all() {
    echo "Closing all SSH connections..."
    for socket in "$SSH_CONTROL_DIR"/*; do
        if [ -S "$socket" ]; then
            ssh -O exit -o ControlPath="$socket" dummy 2>/dev/null
            rm -f "$socket"
        fi
    done
    echo "All connections closed"
}

# Main script logic
case "$1" in
    "start")
        if [ -z "$2" ]; then
            echo "Usage: $0 start <host> [user] [port]"
            exit 1
        fi
        start_ssh "$2" "$3" "$4"
        ;;
    "list")
        list_connections
        ;;
    "close")
        if [ -z "$2" ]; then
            echo "Usage: $0 close <host> [user] [port]"
            exit 1
        fi
        close_connection "$2" "$3" "$4"
        ;;
    "close-all")
        close_all
        ;;
    *)
        echo "SSH Connection Manager"
        echo "Usage:"
        echo "  $0 start <host> [user] [port]  - Start a new SSH connection"
        echo "  $0 list                       - List active connections"
        echo "  $0 close <host> [user] [port] - Close a specific connection"
        echo "  $0 close-all                  - Close all connections"
        ;;
esac 