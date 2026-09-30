import assert from "node:assert/strict";
import { test } from "vitest";

import { loadCommands } from "../src/index.mjs";
import { sandbox } from "./helpers.mjs";

test("commands load from their index.json", async () => {
  const commands = await loadCommands();
  for (const name of ["help", "status", "open", "close", "promote", "repl"]) assert.ok(commands[name], name);
  assert.equal(commands.status.path, "/status");
  assert.equal(typeof commands.status.repl, "function");
  assert.match(commands.status.help().text, /^# status/);
});

test("a command runs through the spine", async () => {
  const { root, bos } = await sandbox();
  const state = await bos.command("status", [], { json: true });
  assert.equal(JSON.parse(state).workshopRoot, root);
  await assert.rejects(bos.command("nope"), /unknown command "nope"/);
});
