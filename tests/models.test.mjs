import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { BOS, models, placeOf, resolveWorkshop } from "../src/index.mjs";
import { sandbox } from "./helpers.mjs";

test("place of a path inside the workshop", () => {
  const root = "/w/__WORKSHOP";
  assert.deepEqual(placeOf(join(root, "forge/bos/bos-skillset/src"), root), { area: "forge", scope: "bos", project: "bos-skillset", inner: "src" });
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

test("seal and verify guard integrity", async () => {
  const { root } = await sandbox();
  mkdirSync(root, { recursive: true });
  writeFileSync(join(root, "procedure.sh"), "echo forge\n");
  const element = new BOS.Model(root);
  element.seal();
  assert.equal(element.verify().ok, true);
  writeFileSync(join(root, "procedure.sh"), "echo tampered\n");
  assert.deepEqual(element.verify().changed, ["procedure.sh"]);
});

test("project anatomy check", () => {
  const { present, missing } = new models.Project(process.cwd()).anatomyCheck();
  assert.ok(present.includes("src") && present.includes("AGENTS.md"));
  assert.deepEqual(missing, []);
});
