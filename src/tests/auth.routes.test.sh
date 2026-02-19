#!/bin/bash

BASE_URL=http://localhost:5001

echo "== Health check =="
curl $BASE_URL/health
echo "\n"

echo "== Request OTP =="
curl -X POST $BASE_URL/auth/mobile/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+919876543210"}'
echo "\n"

echo "== Verify OTP =="
echo "Paste OTP from console:"
read OTP
echo $OTP

curl -X POST $BASE_URL/auth/mobile/verify-otp \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"+919876543210\",\"otp\":\"$OTP\"}"
echo "\n"
