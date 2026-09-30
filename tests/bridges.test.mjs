import assert from "node:assert/strict";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { BRANCHES, PROMOTION, REJECTION, bridges } from "../src/index.mjs";
import { sandbox } from "./helpers.mjs";

test("every bridge extends BOS.Bridge and answers available()", async () => {
  for (const Bridge of Object.values(bridges)) {
    const bridge = new Bridge();
    assert.match(String(bridge), /^\[<BOS\.Bridge::/);
    assert.equal(typeof (await bridge.available()), "boolean");
  }
});

test("branch flow follows the infographic", () => {
  assert.deepEqual(Object.keys(BRANCHES).map((b) => PROMOTION[b]), ["developement", "revision", "testing", "releasing", "master"]);
  for (const branch of ["revision", "testing", "releasing"]) assert.equal(REJECTION[branch], "developement");
});

test("git-client walks one station of the branch flow", async () => {
  const { root, workshop } = await sandbox();
  const repo = join(root, "forge/scope/project");
  mkdirSync(repo, { recursive: true });
  const git = new bridges.gitClient();
  await git.init(repo);
  writeFileSync(join(repo, "a.txt"), "canon\n");
  await git.commit(repo, "canon");
  await git.createBranch(repo, "revision");
  await git.createBranch(repo, "developement");
  await git.checkout(repo, "developement");
  writeFileSync(join(repo, "b.txt"), "work\n");
  await git.commit(repo, "work");

  const plan = await workshop.run("promoting", { cwd: repo, dryRun: true });
  assert.equal(plan.to, "revision");
  assert.ok(plan.plan[0].startsWith("merge developement into revision"));

  writeFileSync(join(repo, "dirty.txt"), "unsaved\n");
  await assert.rejects(workshop.run("promoting", { cwd: repo, dryRun: false }), /uncommitted changes/);
  await git.commit(repo, "save");

  await workshop.run("promoting", { cwd: repo, dryRun: false });
  assert.equal(await git.branch(repo), "revision");
  assert.ok(existsSync(join(repo, "b.txt")));
  assert.equal((await git.log(repo, 1))[0].message, "developement → revision");
  assert.deepEqual(await git.changes(repo), []);
});
