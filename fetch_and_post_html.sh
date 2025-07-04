#!/bin/bash
# filepath: fetch_and_post_html.sh

# Colors for logging
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}Step 1:${NC} Fetching HTML from Wishnet usage page..."

SOURCE_URL="http://192.168.182.201:9085/Kolkata/WISHN/UsageDetailUI.do6?userNameFromParent=28%3AF8%3AC6%3A5B%3AE2%3AB0&itemIndex=0&Month=1&Group=All"
JSESSIONID="7EA9D47BC9EC7F4FE64FB1D06D835135"

HTML_CONTENT=$(curl -sf "$SOURCE_URL" \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
  -H 'Accept-Language: en-IN,en-US;q=0.9,en-GB;q=0.8,en;q=0.7' \
  -H 'Connection: keep-alive' \
  -b "JSESSIONID=$JSESSIONID" \
  -H 'DNT: 1' \
  -H "Referer: $SOURCE_URL" \
  -H 'Upgrade-Insecure-Requests: 1' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36' \
  --insecure)

if [ $? -ne 0 ]; then
  echo -e "${RED}Error:${NC} Failed to fetch HTML from $SOURCE_URL."
  exit 1
fi

if [ -z "$HTML_CONTENT" ]; then
  echo -e "${YELLOW}Warning:${NC} Received empty content from $SOURCE_URL."
  exit 1
fi

echo -e "${GREEN}✔ Successfully fetched HTML content.${NC}"

echo -e "${CYAN}Step 2:${NC} Preparing JSON payload..."
JSON_PAYLOAD=$(echo "$HTML_CONTENT" | jq -Rs --arg key "html" '{($key): .}')
if [ $? -ne 0 ]; then
  echo -e "${RED}Error:${NC} Failed to convert HTML to JSON payload."
  exit 1
fi
echo -e "${GREEN}✔ JSON payload ready.${NC}"

echo -e "${CYAN}Step 3:${NC} Sending data to backend API..."

# Send the JSON payload and capture both response body and HTTP status code
HTTP_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "https://network-session-backend.onrender.com/api/network-usage" \
  -H "Content-Type: application/json" \
  --data-binary "$JSON_PAYLOAD")

# Extract the body and the status
HTTP_BODY=$(echo "$HTTP_RESPONSE" | sed -e 's/HTTPSTATUS\:.*//g')
HTTP_CODE=$(echo "$HTTP_RESPONSE" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [[ "$HTTP_CODE" -ge 200 && "$HTTP_CODE" -lt 300 ]]; then
  echo -e "${GREEN}✔ Data successfully sent to backend!${NC}"
  echo -e "${CYAN}Response:${NC}\n$HTTP_BODY"
else
  echo -e "${RED}Error:${NC} Backend responded with status $HTTP_CODE"
  echo -e "${YELLOW}Response:${NC}\n$HTTP_BODY"
  exit 1
fi