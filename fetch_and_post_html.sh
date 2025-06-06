#!/bin/bash
# filepath: fetch_and_post_html.sh

# Set your variables
SOURCE_URL="http://192.168.182.201:9085/Kolkata/WISHN/UsageDetailUI.do6?userNameFromParent=28%3AF8%3AC6%3A5B%3AE2%3AB0&itemIndex=0&Month=1&Group=All" # The website to fetch HTML from
PROJECT_ID="session-insights-ryswj"     # Replace with your Firebase project ID
REGION="us-central1"             # Change if you use a different region
FUNCTION_NAME="updateNetworkUsage"

# Fetch HTML and send as JSON to your Firebase function
curl -s "$SOURCE_URL" | \
  jq -Rs --arg key "html" '{($key): .}' | \
  curl -X POST "http://localhost:5001/$PROJECT_ID/$REGION/$FUNCTION_NAME" \
    -H "Content-Type: application/json" \
    --data-binary @-

# Explanation:
# - curl -s "$SOURCE_URL": fetches the HTML quietly
# - jq -Rs ...: wraps the HTML as a JSON string under the "html" key
# - second curl: POSTs the JSON to your function