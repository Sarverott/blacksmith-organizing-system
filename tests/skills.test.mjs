import assert from "node:assert/strict";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { BOS, REPO_ROOT } from "../src/index.mjs";

test("skilling drafts a skill per model, registers it, never overwrites", async () => {
  const root = mkdtempSync(join(tmpdir(), "bos-skills-"));
  cpSync(join(REPO_ROOT, "docs", "glossary"), join(root, "docs", "glossary"), { recursive: true });
  mkdirSync(join(root, ".claude-plugin"));
  writeFileSync(join(root, ".claude-plugin", "marketplace.json"), JSON.stringify({ plugins: [{ skills: [] }] }));
  mkdirSync(join(root, "skills", "bos-forge"), { recursive: true });
  writeFileSync(join(root, "skills", "bos-forge", "SKILL.md"), "hand-grown\n");

  const bos = await new BOS({ root }).load();
  const context = await bos.skills.scaffold();

  assert.equal(readFileSync(join(root, "skills", "bos-forge", "SKILL.md"), "utf8"), "hand-grown\n");
  const sheme = readFileSync(join(root, "skills", "bos-sheme", "SKILL.md"), "utf8");
  assert.match(sheme, /^---\nname: bos-sheme\ndescription: "Source material that isn't code, kept next to the projects it belongs with\. Use when/);
  assert.ok(existsSync(join(root, "skills", "bos-craftbook", "SKILL.md")));
  const { skills } = JSON.parse(readFileSync(join(root, ".claude-plugin", "marketplace.json"), "utf8")).plugins[0];
  assert.equal(skills.length, context.skills.length);
  assert.deepEqual((await bos.skills.scaffold()).changes, []);
});
