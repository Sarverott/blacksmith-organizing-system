import assert from "node:assert/strict";
import { test } from "vitest";

import { parseArgs, parseInput } from "../src/index.mjs";
import { sandbox } from "./helpers.mjs";

test("every model's tools gather into one registry: bos <model> <tool>", async () => {
  const { bos } = await sandbox();
  const names = bos.execution.tools.map((t) => `${t.model} ${t.name}`);
  for (const name of ["workshop status", "workshop mode", "house show", "project describe", "project promote"])
    assert.ok(names.includes(name), name);
  assert.equal(new Set(names).size, names.length, "no tool twice");
});

test("operands and flags become validated input", async () => {
  const { bos } = await sandbox();
  const { operands, flags } = parseArgs([
    "project",
    "verify",
    "some/dir",
    "--json",
    "--dry-run",
    "--workshop=/w/__WORKSHOP",
  ]);
  assert.deepEqual(operands, ["project", "verify", "some/dir"]);
  assert.deepEqual(flags, { json: true, dryRun: true, workshop: "/w/__WORKSHOP" });
  assert.deepEqual(parseInput(bos.execution.find("project", "verify"), ["some/dir"], flags), { dir: "some/dir" });
  assert.deepEqual(parseInput(bos.execution.find("house", "show"), [], { all: true }), { all: true });
  assert.throws(
    () => parseInput(bos.execution.find("house", "show"), [], { all: "maybe" }),
    /bad input for house show: all/,
  );
  assert.throws(() => parseInput(bos.execution.find("project", "hook"), [], {}), /bad input for project hook: name/);
});

test("a call runs through the execution controll, rendered for people or machines", async () => {
  const { root, bos } = await sandbox();
  assert.equal(JSON.parse(await bos.run(["workshop", "status", "--json"])).workshopRoot, root);
  assert.match(await bos.run(["workshop", "status"]), /Blacksmith Organization System/);
  assert.equal((await bos.call("workshop", "status")).workshopRoot, root);
  await assert.rejects(bos.run(["forge", "anything"]), /unknown model "forge"/);
  await assert.rejects(bos.run(["workshop", "dance"]), /workshop has no tool "dance"/);
  await assert.rejects(bos.run(["workshop", "mode"]), /name a mode/);
});

test("help comes from the registry", async () => {
  const { bos } = await sandbox();
  const help = (ask = []) => new bos.views.HelpView().text({ tools: bos.execution.tools, ask });
  assert.match(help(), /5 PROVISION\n {2}house show/);
  assert.match(help(["workshop", "mode"]), /COMMANDORATE[\s\S]*\[<mode>\]/);
  assert.doesNotMatch(help(["house"]), /workshop status/);
});
