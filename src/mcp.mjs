#!/usr/bin/env node
// bos-mcp: BOS as an MCP server over stdio (Claude Code loads it from .claude-plugin/mcp.json).
// stdout belongs to the protocol: nothing else may print there.
import { BOS } from "./main.ts";
import { startMcpServer } from "./views/mcp/_index.mjs";

const bos = await new BOS({ workshop: process.env.BOS_WORKSHOP }).load();
await startMcpServer(bos);
