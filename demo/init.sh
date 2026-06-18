#!/bin/bash
curl -s localhost:4100 -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | jq .result.serverInfo
