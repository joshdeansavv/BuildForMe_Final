#!/bin/bash

# BuildForMe Version Navigator
# Easy navigation between git commits to preview different versions

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Get list of commits
COMMITS=($(git log --oneline --reverse | cut -d' ' -f1))
COMMIT_MESSAGES=($(git log --oneline --reverse | cut -d' ' -f2-))

# Find current commit index
CURRENT_COMMIT=$(git rev-parse HEAD)
CURRENT_INDEX=0

for i in "${!COMMITS[@]}"; do
    if [[ "${COMMITS[$i]}" == "${CURRENT_COMMIT:0:7}" ]]; then
        CURRENT_INDEX=$i
        break
    fi
done

# Function to show current status
show_status() {
    echo -e "\n${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}🎯 BuildForMe Version Navigator${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
    
    CURRENT_SHORT=$(git rev-parse --short HEAD)
    CURRENT_MSG=$(git log --oneline -1 --pretty=%s)
    
    echo -e "${GREEN}📍 Current Version:${NC} ${YELLOW}${CURRENT_SHORT}${NC} - ${CURRENT_MSG}"
    echo -e "${BLUE}📊 Position:${NC} ${CURRENT_INDEX}/${#COMMITS[@]} commits"
    echo -e "${BLUE}🌐 Preview:${NC} http://localhost:8081"
    echo ""
    echo -e "${PURPLE}Available Commands:${NC}"
    echo -e "  ${GREEN}next${NC}     - Go to next commit"
    echo -e "  ${GREEN}prev${NC}     - Go to previous commit"
    echo -e "  ${GREEN}list${NC}     - Show all versions"
    echo -e "  ${GREEN}goto <n>${NC} - Go to specific commit number"
    echo -e "  ${GREEN}current${NC}  - Show current version info"
    echo -e "  ${GREEN}restore${NC}  - Restore your original work"
    echo -e "  ${GREEN}help${NC}     - Show this help"
    echo -e "  ${GREEN}exit${NC}     - Exit navigator"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}\n"
}

# Function to switch to commit
switch_to_commit() {
    local index=$1
    if [[ $index -ge 0 && $index -lt ${#COMMITS[@]} ]]; then
        echo -e "${BLUE}🔄 Switching to commit ${index}...${NC}"
        git checkout "${COMMITS[$index]}" 2>/dev/null
        CURRENT_INDEX=$index
        show_status
        echo -e "${GREEN}✅ Switched! Refresh your browser to see changes.${NC}"
    else
        echo -e "${RED}❌ Invalid commit index. Use 'list' to see available versions.${NC}"
    fi
}

# Function to list all commits
list_commits() {
    echo -e "\n${PURPLE}📋 Available Versions:${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
    for i in "${!COMMITS[@]}"; do
        local commit="${COMMITS[$i]}"
        local msg=$(git log --oneline -1 --pretty=%s "$commit")
        local marker=""
        if [[ $i -eq $CURRENT_INDEX ]]; then
            marker="${GREEN}👈 CURRENT${NC}"
        fi
        echo -e "  ${YELLOW}$i${NC}: ${BLUE}$commit${NC} - $msg $marker"
    done
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}\n"
}

# Function to restore original work
restore_work() {
    echo -e "${BLUE}🔄 Restoring your original work...${NC}"
    git checkout main 2>/dev/null
    git stash pop 2>/dev/null
    echo -e "${GREEN}✅ Work restored! You're back to your main branch.${NC}"
    exit 0
}

# Main navigation loop
navigate() {
    show_status
    
    while true; do
        echo -e "${BLUE}Navigator>${NC} \c"
        read -r command args
        
        case $command in
            "next")
                if [[ $CURRENT_INDEX -lt $((${#COMMITS[@]}-1)) ]]; then
                    switch_to_commit $((CURRENT_INDEX + 1))
                else
                    echo -e "${YELLOW}⚠️  Already at the latest commit!${NC}"
                fi
                ;;
            "prev")
                if [[ $CURRENT_INDEX -gt 0 ]]; then
                    switch_to_commit $((CURRENT_INDEX - 1))
                else
                    echo -e "${YELLOW}⚠️  Already at the first commit!${NC}"
                fi
                ;;
            "goto")
                if [[ -n "$args" ]]; then
                    switch_to_commit "$args"
                else
                    echo -e "${RED}❌ Usage: goto <number>${NC}"
                fi
                ;;
            "list")
                list_commits
                ;;
            "current")
                show_status
                ;;
            "restore")
                restore_work
                ;;
            "help")
                show_status
                ;;
            "exit")
                echo -e "${GREEN}👋 Exiting navigator...${NC}"
                restore_work
                ;;
            "")
                # Just pressed enter, show status
                ;;
            *)
                echo -e "${RED}❌ Unknown command: $command${NC}"
                echo -e "${BLUE}💡 Type 'help' for available commands${NC}"
                ;;
        esac
    done
}

# Start the navigator
navigate 