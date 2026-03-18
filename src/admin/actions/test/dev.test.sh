#!/bin/bash

BASE_URL="http://localhost:5051/admin/department"

echo "🚀 Testing Department API"


# 1. Create
echo "➡️ Creating department..."
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/create" \
-H "Content-Type: application/json" \
-d '{
    "name": "Computer Science",
    "code": "CSE123",
    "description": "CS Dept",
    "status": true
}')

echo "Response: $CREATE_RESPONSE"

DEPT_ID=$(echo $CREATE_RESPONSE | jq -r '.data.id')
echo "Created ID: $DEPT_ID"

# 2. Get
echo "➡️ Fetching departments..."
curl -s -X GET "$BASE_URL/getData?page=1" | jq

# 3. Update
echo "➡️ Updating department..."
curl -s -X PUT "$BASE_URL/update/CSE123" \
-H "Content-Type: application/json" \
-d '{
    "name": "Updated Department"
}' | jq

# 4. Delete
echo "➡️ Deleting department..."
curl -s -X DELETE "$BASE_URL/delete/CSE123" | jq

echo "✅ Done"
