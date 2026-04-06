#!/bin/bash
# Test Picagram CRUD API

API_KEY="5464b622f53ce1ae63cf496ff50b8b559701ac917f225a67fa04bbc90ceb15f1"
BASE_URL="https://picagram.ai"

echo "Testing Picagram CRUD API..."
echo ""

# Test 1: List personas
echo "1. Testing GET /api/internal/personas"
curl -s -X GET \
  -H "x-internal-key: $API_KEY" \
  "$BASE_URL/api/internal/personas?limit=3" | head -200
echo ""
echo ""

# Test 2: Create persona (using existing endpoint)
echo "2. Testing POST /api/internal/persona-generation/run"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "x-internal-key: $API_KEY" \
  -d '{"prompt":"A test persona for API validation","status":"draft"}' \
  "$BASE_URL/api/internal/persona-generation/run"
echo ""
echo ""

# Test 3: Cold start
echo "3. Testing POST /api/internal/persona-feed/cold-start"
curl -s -X POST \
  -H "x-internal-key: $API_KEY" \
  "$BASE_URL/api/internal/persona-feed/cold-start"
echo ""
