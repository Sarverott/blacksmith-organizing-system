// BOS over the Model Context Protocol (stdio), generated from the tool registry.
// Only read-only tools are offered: agents look and plan through MCP; changing the
// workshop stays a conscious act on the command line.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { VERSION } from "../../core/self.mjs";

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, openWorldHint: false };

export const mcpName = (entry) => `${entry.model}_${entry.name}`.replace(/-/g, "_");

export function createMcpServer(bos) {
  const server = new McpServer({ name: "bos", version: VERSION });
  for (const entry of bos.execution.tools.filter((t) => t.readOnly)) {
    server.registerTool(
      mcpName(entry),
      {
        description: `bos ${entry.model} ${entry.name}: ${entry.info}`,
        inputSchema: entry.input,
        annotations: READ_ONLY,
      },
      async (input = {}) => {
        try {
          const { result } = await bos.execution.call(entry.model, entry.name, input);
          return { content: [{ type: "text", text: bos.execution.render(entry, result) }] };
        } catch (error) {
          return { isError: true, content: [{ type: "text", text: `${mcpName(entry)}: ${error.message}` }] };
        }
      },
    );
  }
  return server;
}

export async function startMcpServer(bos) {
  await createMcpServer(bos).connect(new StdioServerTransport());
}
