#!/bin/bash

BASE_URL="http://localhost:5051"

echo "Enter email:"
read EMAIL

echo "Calling forgot-password..."
curl -s -X POST "$BASE_URL/admin/auth/forgot-password" \
-H "Content-Type: application/json" \
-d "{\"email\":\"$EMAIL\"}"

echo ""
echo "--------------------------------------"

echo "Paste FULL reset URL:"
read FULL_URL

echo "Enter new password:"
read NEW_PASSWORD

echo "Calling reset-password..."

curl -s -X POST "$FULL_URL" \
-H "Content-Type: application/json" \
-d "{\"newPassword\":\"$NEW_PASSWORD\"}"

echo ""
echo "Done."
