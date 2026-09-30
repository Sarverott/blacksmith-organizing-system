import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { sandbox } from "./helpers.mjs";

test("opening builds the whole workshop and records it", async () => {
  const { root, workshop } = await sandbox();
  await workshop.open();
  for (const part of [".BOS/setup", ".BOS/data", ".BOS/nests/.index.json", ".BOS/nests/.manifest.json",
    ".BOS/workshop.json", ".BOS/Taskfile.yaml", "devarmory/manifest.json", "forge", "craftbook/scrapnotes",
    "archive", "AGENTS.md", "CLAUDE.md", ".BOS/storylines/metadata.json"]) {
    assert.ok(existsSync(join(root, part)), `missing ${part}`);
  }
  const log = readFileSync(join(root, ".BOS/storylines/logs/workshop.jsonl"), "utf8");
  assert.equal(JSON.parse(log).event, "open");
});

test("bootstrapping is idempotent and never overwrites", async () => {
  const { root, workshop } = await sandbox();
  mkdirSync(root, { recursive: true });
  writeFileSync(join(root, "AGENTS.md"), "my own rules\n");
  await workshop.bootstrap();
  assert.deepEqual((await workshop.bootstrap()).changes, []);
  assert.equal(readFileSync(join(root, "AGENTS.md"), "utf8"), "my own rules\n");
});

test("dry run plans without touching the disk", async () => {
  const { root, workshop } = await sandbox();
  const context = await workshop.bootstrap({ dryRun: true });
  assert.ok(context.changes.includes(join(root, "forge")));
  assert.equal(existsSync(root), false);
});

test("storylines appear only with use", async () => {
  const { root, workshop } = await sandbox();
  await workshop.bootstrap();
  assert.equal(existsSync(join(root, ".BOS/storylines")), false);
});

test("closing keeps shell history as a ttystory", async () => {
  const { root, workshop } = await sandbox();
  mkdirSync(root, { recursive: true });
  process.env.HISTFILE = join(root, "..", "history");
  writeFileSync(process.env.HISTFILE, "ls\ngit status\n");
  const context = await workshop.close();
  assert.match(context.ttystory, /ttystory-.+-\d+\.txt$/);
  assert.equal(readFileSync(context.ttystory, "utf8"), "ls\ngit status\n");
});

test("unknown host role is rejected", async () => {
  const { root, workshop } = await sandbox();
  mkdirSync(join(root, ".BOS"), { recursive: true });
  writeFileSync(join(root, ".BOS/workshop.json"), JSON.stringify({ role: "castle" }));
  await assert.rejects(workshop.status(), /unknown host role "castle"/);
});

test("sinking inventories forge projects", async () => {
  const { root, bos, workshop } = await sandbox();
  await workshop.bootstrap();
  const project = join(root, "forge/my-scope/my-project");
  mkdirSync(project, { recursive: true });
  await new bos.bridges.gitClient().init(project);
  writeFileSync(join(project, "draft.txt"), "wip\n");
  const { inventory } = await workshop.sink();
  assert.deepEqual(inventory.projects, [{ scope: "my-scope", project: "my-project", branch: "master", uncommitted: 1 }]);
});
