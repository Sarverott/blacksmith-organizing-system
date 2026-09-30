import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { test } from "vitest";
import { brief, recordAgentCommand, recordAgentEvent } from "../src/views/agent/_index.mjs";
import { createMcpServer } from "../src/views/mcp/_index.mjs";
import { sandbox } from "./helpers.mjs";

async function connected(bos) {
  const [clientSide, serverSide] = InMemoryTransport.createLinkedPair();
  await createMcpServer(bos).connect(serverSide);
  const client = new Client({ name: "test", version: "0" });
  await client.connect(clientSide);
  return client;
}

test("MCP: the read-only tools of the registry answer", async () => {
  const { root, bos } = await sandbox();
  const client = await connected(bos);
  const { tools } = await client.listTools();
  const expected = bos.execution.tools.filter((t) => t.readOnly).map((t) => `${t.model}_${t.name}`.replace(/-/g, "_"));
  assert.deepEqual(tools.map((t) => t.name).sort(), expected.sort());
  assert.ok(
    !tools.some((t) => ["workshop_bootstrap", "workshop_mode", "project_promote"].includes(t.name)),
    "no writing tool over MCP",
  );
  assert.ok(tools.every((t) => t.annotations?.readOnlyHint));
  const status = await client.callTool({ name: "workshop_status", arguments: {} });
  assert.match(status.content[0].text, new RegExp(root.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  const page = await client.callTool({ name: "workshop_glossary", arguments: { term: "house" } });
  assert.match(page.content[0].text, /^# House/);
  const missing = await client.callTool({ name: "workshop_glossary", arguments: { term: "../../etc/passwd" } });
  assert.match(missing.content[0].text, /no glossary page/);
});

test("agent hooks: a brief, and the agent's work in storylines", async () => {
  const { root, workshop } = await sandbox();
  process.env.BOS_WORKSHOP = root;
  assert.equal(await brief({ cwd: process.cwd() }), null, "no workshop yet: silent, nothing created");
  assert.equal(existsSync(root), false);

  await workshop.bootstrap();
  const scope = join(root, "forge", "scope", "project");
  mkdirSync(scope, { recursive: true });
  const text = await brief({ cwd: scope });
  assert.match(text, /you are in: forge \/ scope \/ project/);
  assert.match(text, /Resting, never call or prompt: EON/);

  await recordAgentEvent({ cwd: scope, session_id: "s1", source: "startup" }, "agent-session-start");
  const file = await recordAgentCommand({
    cwd: scope,
    session_id: "s1",
    tool_input: { command: "npm test\necho done" },
  });
  assert.match(readFileSync(file, "utf8"), /^\d+\t.+\/forge\/scope\/project\tnpm test\\necho done\n$/);
  const log = readFileSync(join(root, ".BOS/storylines/logs/workshop.jsonl"), "utf8")
    .trim()
    .split("\n")
    .map(JSON.parse);
  assert.deepEqual(
    log.map((e) => [e.event, e.session, e.place?.project]),
    [["agent-session-start", "s1", "project"]],
  );
});
