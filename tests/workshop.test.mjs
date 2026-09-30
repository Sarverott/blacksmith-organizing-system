import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, test } from "node:test";

import { BasicModel, PROMOTION, REJECTION, WorkshopControll, placeOf, resolveWorkshop } from "../src/index.mjs";

let root;
const controll = () => new WorkshopControll({ workshop: root });

beforeEach(() => {
  root = join(mkdtempSync(join(tmpdir(), "bos-")), "__WORKSHOP");
});

test("open builds the whole workshop and records it", async () => {
  await controll().run("open");
  for (const part of [".BOS/setup", ".BOS/data", ".BOS/nests/.index.json", ".BOS/nests/.manifest.json",
    ".BOS/workshop.json", ".BOS/Taskfile.yaml", "devarmory/manifest.json", "forge", "craftbook/scrapnotes",
    "archive", "AGENTS.md", "CLAUDE.md", ".BOS/storylines/metadata.json"]) {
    assert.ok(existsSync(join(root, part)), `missing ${part}`);
  }
  const log = readFileSync(join(root, ".BOS/storylines/logs/workshop.jsonl"), "utf8");
  assert.equal(JSON.parse(log).event, "open");
});

test("bootstrap is idempotent and never overwrites", async () => {
  mkdirSync(root, { recursive: true });
  writeFileSync(join(root, "AGENTS.md"), "my own rules\n");
  await controll().run("bootstrap");
  const again = await controll().run("bootstrap");
  assert.deepEqual(again.changes, []);
  assert.equal(readFileSync(join(root, "AGENTS.md"), "utf8"), "my own rules\n");
});

test("dry run plans without touching the disk", async () => {
  const context = await controll().run("bootstrap", { dryRun: true });
  assert.ok(context.changes.includes(join(root, "forge")));
  assert.equal(existsSync(root), false);
});

test("storylines appear only with use, not at bootstrap", async () => {
  await controll().run("bootstrap");
  assert.equal(existsSync(join(root, ".BOS/storylines")), false);
});

test("close keeps shell history as a ttystory", async () => {
  const history = join(root, "..", "history");
  writeFileSync(history, "ls\ngit status\n");
  process.env.HISTFILE = history;
  const context = await controll().run("close");
  assert.match(context.ttystory, /ttystory-.+-\d+\.txt$/);
  assert.equal(readFileSync(context.ttystory, "utf8"), "ls\ngit status\n");
});

test("unknown host role is rejected", async () => {
  mkdirSync(join(root, ".BOS"), { recursive: true });
  writeFileSync(join(root, ".BOS/workshop.json"), JSON.stringify({ role: "castle" }));
  await assert.rejects(controll().run("status"), /unknown host role "castle"/);
});

test("place of a path inside the workshop", () => {
  assert.deepEqual(placeOf(join(root, "forge/bos/bos-skillset/src"), root),
    { area: "forge", scope: "bos", project: "bos-skillset", inner: "src" });
  assert.deepEqual(placeOf(join(root, "archive/pack"), root), { area: "archive", inner: "pack" });
  assert.equal(placeOf("/elsewhere", root), null);
});

test("workshop resolution order", () => {
  const home = "/home/smith";
  assert.equal(resolveWorkshop({ explicit: "/x/__WORKSHOP", variable: "/y/__WORKSHOP", cwd: "/", self: "/", home }).source, "--workshop option");
  assert.equal(resolveWorkshop({ variable: "~/__WORKSHOP", cwd: "/", self: "/", home }).root, "/home/smith/__WORKSHOP");
  assert.equal(resolveWorkshop({ cwd: "/media/usb/__WORKSHOP/forge", self: "/", home }).root, "/media/usb/__WORKSHOP");
  assert.equal(resolveWorkshop({ cwd: "/tmp", self: "/opt/__WORKSHOP/forge/bos", home }).source, "ancestor of BOS installation");
  assert.equal(resolveWorkshop({ cwd: "/tmp", self: "/opt", home }).root, "/home/smith/__WORKSHOP");
});

test("seal and verify guard integrity", () => {
  const dir = join(root, "craftset");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "procedure.sh"), "echo forge\n");
  const element = new BasicModel(dir);
  element.seal();
  assert.equal(element.verify().ok, true);
  writeFileSync(join(dir, "procedure.sh"), "echo tampered\n");
  assert.deepEqual(element.verify().changed, ["procedure.sh"]);
});

test("branch flow follows the infographic", () => {
  assert.deepEqual(
    ["master", "developement", "revision", "testing", "releasing"].map((branch) => PROMOTION[branch]),
    ["developement", "revision", "testing", "releasing", "master"]
  );
  for (const branch of ["revision", "testing", "releasing"]) assert.equal(REJECTION[branch], "developement");
});
