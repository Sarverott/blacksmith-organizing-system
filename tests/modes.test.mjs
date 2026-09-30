import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PassThrough } from "node:stream";
import { test } from "node:test";

import { MODES, loadCommands, modeByDigit, views } from "../src/index.mjs";
import { sandbox } from "./helpers.mjs";

test("five modes, digits 1-5, in the order of the author", () => {
  assert.deepEqual(Object.keys(MODES), ["almanac", "conform", "smeltry", "commandorate", "provision"]);
  assert.deepEqual([1, 2, 3, 4, 5].map(modeByDigit), Object.keys(MODES));
  assert.equal(modeByDigit(0), null);
});

test("switching keeps workshop.json and records only real changes", async () => {
  const { root, workshop } = await sandbox();
  mkdirSync(join(root, ".BOS"), { recursive: true });
  writeFileSync(join(root, ".BOS/workshop.json"), JSON.stringify({ name: "home", role: "forging-point" }));
  await workshop.mode("3");
  await workshop.mode("smeltry");
  await workshop.mode("almanac");
  assert.deepEqual(JSON.parse(readFileSync(join(root, ".BOS/workshop.json"), "utf8")), { name: "home", role: "forging-point", mode: "almanac" });
  const events = readFileSync(join(root, ".BOS/storylines/logs/workshop.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
  assert.deepEqual(events.map(({ from, to }) => [from, to]), [[null, "smeltry"], ["smeltry", "almanac"]]);
  assert.equal((await workshop.status()).config.mode, "almanac");
  await assert.rejects(workshop.mode("castle"), /unknown mode "castle"/);
});

test("chooser takes one digit; anything else leaves with 0", async () => {
  const ask = async (text) => {
    const input = new PassThrough();
    const output = new PassThrough();
    const answer = views.chooseDigit("? ", 5, { input, output });
    input.end(text);
    return answer;
  };
  assert.equal(await ask("4\n"), 4);
  assert.equal(await ask("0\n"), 0);
  assert.equal(await ask("9\n"), 0);
  assert.equal(await ask(""), 0);
});

test("commands are tagged with the mode they serve", async () => {
  const commands = await loadCommands();
  assert.equal(commands.sink.mode, "almanac");
  assert.equal(commands.open.mode, "conform");
  assert.equal(commands.promote.mode, "smeltry");
  assert.equal(commands.mode.mode, "commandorate");
  assert.equal(commands.status.mode, null);
  for (const command of Object.values(commands)) assert.ok(command.mode === null || command.mode in MODES, command.name);
});
