BASE_URL=http://localhost:5001

echo "== Wrong method =="
curl -X GET $BASE_URL/auth/request-otp
echo "\n"

echo "== Wrong path =="
curl $BASE_URL/auth/unknown
echo "\n"
