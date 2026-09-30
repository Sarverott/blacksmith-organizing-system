#!/usr/bin/env node
// Claude Code hooks → BOS (hooks/hooks.json). Reads the hook's JSON from stdin.
//   session-start  prints a short brief (becomes the agent's context) and records the session
//   bash           appends the agent's shell command to its ttystory in storylines
//   session-end    records the end of the session
// Loads no bridges, so it stays fast; never fails the agent (always exits 0).
import { brief, recordAgentCommand, recordAgentEvent } from "./views/agent/_index.mjs";

const event = process.argv[2];
let input = {};
try {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  input = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
} catch {}

try {
  if (event === "session-start") {
    const text = await brief(input);
    if (text) process.stdout.write(text);
    await recordAgentEvent(input, "agent-session-start");
  } else if (event === "bash") {
    await recordAgentCommand(input);
  } else if (event === "session-end") {
    await recordAgentEvent(input, "agent-session-end");
  }
} catch {}
process.exit(0);
