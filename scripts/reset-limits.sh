#!/bin/bash

# Reset Rate Limits Helper Script
# Usage: ./scripts/reset-limits.sh [option]

BASE_URL="http://localhost:3000"
ENDPOINT="/api/dev/reset-limits"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}   Rate Limits Reset Tool${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Function to make request and show result
make_request() {
    local url=$1
    local description=$2

    echo -e "${YELLOW}→ ${description}${NC}"
    echo -e "${BLUE}URL: ${url}${NC}"
    echo ""

    response=$(curl -s "${url}")

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Response:${NC}"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
    else
        echo -e "${RED}✗ Request failed${NC}"
    fi

    echo ""
    echo -e "${BLUE}=====================================${NC}"
    echo ""
}

# Parse command line arguments
case "$1" in
    "current"|"")
        make_request "${BASE_URL}${ENDPOINT}" "Resetting current user/IP limits"
        ;;

    "all")
        make_request "${BASE_URL}${ENDPOINT}?all=true" "Resetting ALL limits (guests + users)"
        ;;

    "user")
        if [ -z "$2" ]; then
            echo -e "${RED}Error: userId required${NC}"
            echo "Usage: $0 user <userId>"
            echo "Example: $0 user user_2abc123"
            exit 1
        fi
        make_request "${BASE_URL}${ENDPOINT}?userId=$2" "Resetting limits for user: $2"
        ;;

    "ip")
        if [ -z "$2" ]; then
            echo -e "${RED}Error: IP address required${NC}"
            echo "Usage: $0 ip <ip_address>"
            echo "Example: $0 ip 192.168.1.1"
            exit 1
        fi
        make_request "${BASE_URL}${ENDPOINT}?ip=$2" "Resetting limits for IP: $2"
        ;;

    "pattern")
        if [ -z "$2" ]; then
            echo -e "${RED}Error: Redis pattern required${NC}"
            echo "Usage: $0 pattern <pattern>"
            echo "Example: $0 pattern 'messages:user:*'"
            exit 1
        fi
        make_request "${BASE_URL}${ENDPOINT}?pattern=$2" "Resetting limits matching pattern: $2"
        ;;

    "help"|"-h"|"--help")
        echo "Usage: $0 [option] [value]"
        echo ""
        echo "Options:"
        echo "  current          Reset current user/IP limits (default)"
        echo "  all              Reset ALL limits (guests + users)"
        echo "  user <userId>    Reset specific Clerk user limits"
        echo "  ip <ip>          Reset specific guest IP limits"
        echo "  pattern <pat>    Reset using Redis pattern"
        echo "  help             Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0                                 # Reset current user"
        echo "  $0 all                             # Reset everything"
        echo "  $0 user user_2abc123xyz            # Reset specific user"
        echo "  $0 ip 192.168.1.1                  # Reset specific IP"
        echo "  $0 pattern 'messages:user:*'       # Reset all user messages"
        echo ""
        ;;

    *)
        echo -e "${RED}Error: Unknown option '$1'${NC}"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
esac
