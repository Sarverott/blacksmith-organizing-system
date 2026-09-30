import assert from "node:assert/strict";
import { join } from "node:path";
import { test } from "vitest";

import { BOS, models, submodules } from "../src/index.mjs";

const workshop = new models.Workshop("/w/__WORKSHOP");

test("submodules hang on their owner as properties", () => {
  assert.equal(workshop.storylines.path, "/w/__WORKSHOP/.BOS/storylines");
  assert.equal(workshop.storylines.logs.path, "/w/__WORKSHOP/.BOS/storylines/logs");
  assert.equal(workshop.storylines.owner, workshop);
  assert.equal(workshop.storylines, workshop.storylines, "cached");
});

test("a submodule cannot exist without its owner", () => {
  assert.throws(() => new submodules.Storylines("/tmp/anything"), /build it from its owner/);
  assert.throws(() => new submodules.Storylines(new models.Forge("/w/__WORKSHOP/forge")), /hangs on a workshop, not on a forge/);
});

test("moving a class between model and submodule is one extends line", () => {
  assert.ok(submodules.Nests.prototype instanceof BOS.Submodule);
  assert.ok(models.Forge.prototype instanceof BOS.Model);
  for (const Base of [BOS.Model, BOS.Submodule]) {
    for (const method of ["ensure", "inspect", "seal", "verify"]) assert.equal(typeof Base.prototype[method], "function");
  }
});

test(".BOS organs nest under .BOS in the tree", () => {
  const bos = workshop.inspect().children.find((node) => node.type === "system");
  assert.deepEqual(bos.children.map((node) => node.type), ["setup", "data", "nestrelm", "storylines"]);
  assert.equal(join(bos.path, "storylines"), bos.children[3].path);
});
