// BOS over the Model Context Protocol (stdio): every TOOLS entry becomes an MCP tool.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { VERSION } from "../../core/self.mjs";
import { READ_ONLY, TOOLS } from "./tools.mjs";

export function createMcpServer(bos) {
  const server = new McpServer({ name: "bos", version: VERSION });
  for (const tool of TOOLS) {
    server.registerTool(
      tool.name,
      { description: tool.description, inputSchema: tool.input, annotations: READ_ONLY },
      async (args = {}) => {
        try {
          const output = await tool.run(bos, args);
          return {
            content: [{ type: "text", text: typeof output === "string" ? output : JSON.stringify(output, null, 2) }],
          };
        } catch (error) {
          return { isError: true, content: [{ type: "text", text: `${tool.name}: ${error.message}` }] };
        }
      },
    );
  }
  return server;
}

export async function startMcpServer(bos) {
  await createMcpServer(bos).connect(new StdioServerTransport());
}
