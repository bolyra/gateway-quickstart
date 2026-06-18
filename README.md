# Bolyra Gateway Quickstart

Protect any MCP server with [`@bolyra/gateway`](https://www.npmjs.com/package/@bolyra/gateway) in under 2 minutes. Zero auth code in your server.

![demo](demo.gif)

## What this does

```
Agent ---> @bolyra/gateway (port 4100) ---> Your MCP Server (port 3000)
            |                                   |
            | verifyBundle()                    | just handles tools
            | checkToolPolicy()                 | reads X-Bolyra-* headers
            | rejectReplay()                    | no crypto, no proofs
            | emitReceipt()                     |
```

The gateway sits in front of your MCP server. It verifies agent credentials, enforces per-tool permissions, prevents replay attacks, and writes signed audit receipts. Your server never imports a crypto library.

## Quick start

```bash
git clone https://github.com/bolyra/gateway-quickstart.git
cd gateway-quickstart
npm install
```

**Terminal 1** -- start the MCP server:

```bash
npm run server
```

**Terminal 2** -- start the gateway:

```bash
npm run gateway
```

That's it. The gateway is running on `http://localhost:4100` and proxying to your server on `http://localhost:3000/mcp`.

## Try it

### List files (allowed -- requires READ_DATA)

```bash
curl -s http://localhost:4100 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"list_files","arguments":{}}}' | jq
```

### Read a file (allowed -- requires READ_DATA)

```bash
curl -s http://localhost:4100 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"read_file","arguments":{"name":"hello.txt"}}}' | jq
```

### Write a file (requires WRITE_DATA -- higher permission)

```bash
curl -s http://localhost:4100 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"write_file","arguments":{"name":"new.txt","content":"created via gateway"}}}' | jq
```

### Check the health endpoint

```bash
curl -s http://localhost:4100/healthz | jq
```

### Check receipts

Every auth decision (allow or deny) produces a signed receipt:

```bash
ls receipts/
cat receipts/*.json | jq
```

## What's in gateway.yaml

```yaml
target: http://localhost:3000/mcp   # your MCP server
port: 4100                          # gateway listens here
devMode: true                       # mock verification (no real ZKP)

toolPolicy:
  list_files: 1    # READ_DATA permission required
  read_file: 1     # READ_DATA permission required
  write_file: 2    # WRITE_DATA permission required

receipts:
  file: ./receipts/
```

The `toolPolicy` maps tool names to permission bitmasks. The gateway checks the agent's credential against this policy before forwarding the request. [Permission reference](https://bolyra.ai/#architecture).

## What your server sees

After the gateway verifies a request, it injects headers:

```
X-Bolyra-Verified: true
X-Bolyra-DID: did:bolyra:base-sepolia:0x1a2b...
X-Bolyra-Permissions: 3
```

Your server reads these headers to know who passed verification. See `server.js` lines 23-26.

## Next steps

- **Production mode:** Remove `devMode: true` and configure real credential resolution. See the [production guide](https://github.com/bolyra/bolyra/tree/main/integrations/mcp/examples/production-server).
- **HMAC header signing:** Add `hmac.secret` to `gateway.yaml` so your upstream can verify `X-Bolyra-*` headers weren't forged.
- **Middleware alternative:** If you prefer auth inside your server, use [`@bolyra/mcp`](https://www.npmjs.com/package/@bolyra/mcp) directly.
- **Full docs:** [bolyra.ai](https://bolyra.ai) | [GitHub](https://github.com/bolyra/bolyra)

## License

Apache-2.0
