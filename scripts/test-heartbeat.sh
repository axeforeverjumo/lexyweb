#!/bin/bash

# Test heartbeat endpoint after RLS fix
# Run this after applying the database migration

set -e

echo "Testing heartbeat endpoint..."
echo "=============================================="
echo ""

CONTRACT_ID="93b9f8be-bd6b-417d-883c-91bfa5c6d86d"
API_URL="http://localhost:3000/api/contracts/${CONTRACT_ID}/collaborators/heartbeat"

echo "Endpoint: POST $API_URL"
echo ""

# Make request (will need authentication cookie)
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{}' \
  -v \
  2>&1 | grep -E "(HTTP|error|success)"

echo ""
echo "=============================================="
echo ""
echo "Expected results:"
echo "  ✓ Status 200 (if authenticated)"
echo "  ✓ Status 401 (if not authenticated - this is OK)"
echo "  ✗ Status 500 (RLS recursion error - needs migration)"
echo ""
