#!/bin/bash
cd backend

# Get token and KP number
TOKEN=$(node get-token.js)
KPNUMBER=$(node get-kp.js)

# Start server
node index.js > server_temp.log 2>&1 &
SERVER_PID=$!
sleep 3

PORT=3000

echo "=== HTTP Request & Status ==="
curl -s -i -H "Authorization: Bearer $TOKEN" http://localhost:$PORT/api/kp/$KPNUMBER/export/xlsx > response.txt
head -n 20 response.txt | grep -E '^HTTP|^Content-|^X-|^{'

echo "=== Body (First 150 lines) ==="
tail -n +11 response.txt | node -e '
  const fs = require("fs");
  const data = fs.readFileSync(0, "utf-8");
  try {
    const json = JSON.parse(data);
    const str = JSON.stringify(json, null, 2);
    console.log(str.split("\\n").slice(0, 150).join("\\n"));
  } catch(e) {
    console.log("Not JSON:", data.substring(0, 500));
  }
'

kill $SERVER_PID
