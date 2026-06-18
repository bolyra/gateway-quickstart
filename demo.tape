# Bolyra Gateway Quickstart Demo
# Pre-req: start server + gateway first, then run: vhs demo.tape

Output demo.gif
Output demo.mp4

Set Shell "bash"
Set FontSize 16
Set Width 1100
Set Height 650
Set Theme "Catppuccin Mocha"
Set Padding 20
Set TypingSpeed 35ms

Hide
Type "cd /Users/lordviswa/Projects/gateway-quickstart && rm -rf receipts/ && clear"
Enter
Sleep 1s
Show

Type "# @bolyra/gateway: protect any MCP server in under 2 minutes"
Enter
Sleep 2.5s

Type "cat gateway.yaml"
Enter
Sleep 5s

Type ""
Enter
Type "# 1. initialize passes through (no auth needed)"
Enter
Sleep 1.5s
Type "bash demo/init.sh"
Enter
Sleep 3.5s

Type ""
Enter
Type "# 2. tools/call without credentials -- DENIED"
Enter
Sleep 1.5s
Type "bash demo/list.sh"
Enter
Sleep 4s

Type ""
Enter
Type "# 3. every decision gets a signed receipt"
Enter
Sleep 1.5s
Type "cat receipts/*/*.json | jq '{decision, toolName, method, timestamp}'"
Enter
Sleep 4s

Type ""
Enter
Type "# 4. health endpoint"
Enter
Sleep 1.5s
Type "curl -s localhost:4100/healthz | jq ."
Enter
Sleep 3.5s

Type ""
Enter
Type "# 5. your server has ZERO auth code"
Enter
Sleep 1.5s
Type "grep -c 'bolyra\|verify\|proof\|crypto' server.js || echo '0 matches'"
Enter
Sleep 2.5s
Type "wc -l server.js"
Enter
Sleep 2.5s

Type ""
Enter
Type "# the entire auth config: 12 lines of YAML"
Enter
Sleep 1.5s
Type "wc -l gateway.yaml"
Enter
Sleep 3s

Type ""
Enter
Type "# npm install @bolyra/gateway"
Enter
Type "# https://bolyra.ai"
Enter
Sleep 5s
