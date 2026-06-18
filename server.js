/**
 * A plain MCP server with zero auth code.
 * Three tools: list_files, read_file, write_file.
 * The gateway handles all authentication in front of this.
 */

const express = require("express");
const app = express();
app.use(express.json());

// In-memory file store
const files = {
  "hello.txt": "Hello from the MCP server!",
  "secret.txt": "This file requires WRITE_DATA permission to modify.",
};

// JSON-RPC handler
app.post("/mcp", (req, res) => {
  const { id, method, params } = req.body;

  // Log auth headers from the gateway (if present)
  const verified = req.headers["x-bolyra-verified"];
  const did = req.headers["x-bolyra-did"];
  if (verified) {
    console.log(`[server] Verified agent: ${did || "unknown"}`);
  }

  if (method === "initialize") {
    return res.json({
      jsonrpc: "2.0", id,
      result: {
        protocolVersion: "2025-06-18",
        serverInfo: { name: "quickstart-server", version: "1.0.0" },
        capabilities: { tools: { listChanged: false } },
      },
    });
  }

  if (method === "tools/list") {
    return res.json({
      jsonrpc: "2.0", id,
      result: {
        tools: [
          { name: "list_files", description: "List all files", inputSchema: { type: "object", properties: {} } },
          { name: "read_file", description: "Read a file", inputSchema: { type: "object", properties: { name: { type: "string" } }, required: ["name"] } },
          { name: "write_file", description: "Write a file", inputSchema: { type: "object", properties: { name: { type: "string" }, content: { type: "string" } }, required: ["name", "content"] } },
        ],
      },
    });
  }

  if (method === "tools/call") {
    const tool = params?.name;
    const args = params?.arguments || {};

    if (tool === "list_files") {
      return res.json({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: Object.keys(files).join("\n") }] } });
    }
    if (tool === "read_file") {
      const text = files[args.name];
      if (!text) return res.json({ jsonrpc: "2.0", id, error: { code: -32602, message: `File not found: ${args.name}` } });
      return res.json({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text }] } });
    }
    if (tool === "write_file") {
      files[args.name] = args.content;
      return res.json({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: `Wrote ${args.name}` }] } });
    }

    return res.json({ jsonrpc: "2.0", id, error: { code: -32601, message: `Unknown tool: ${tool}` } });
  }

  res.json({ jsonrpc: "2.0", id, error: { code: -32601, message: `Unknown method: ${method}` } });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[server] MCP server running on http://localhost:${PORT}/mcp`);
  console.log("[server] No auth code here -- the gateway handles that.");
});
