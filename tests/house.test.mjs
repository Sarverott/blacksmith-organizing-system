import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "vitest";
import { bloodlineOf, rootOf } from "../src/models/house/bloodlines.mjs";
import House from "../src/models/house/class.mjs";
import { mergeResidents } from "../src/procedures/gathering/merge-residents.mjs";

function houseAt({ children = {}, orders = {}, releasers = [] }) {
  const dir = mkdtempSync(join(tmpdir(), "bos-house-"));
  for (const [kind, groups] of Object.entries({ children, orders })) {
    mkdirSync(join(dir, kind));
    for (const [name, group] of Object.entries(groups))
      writeFileSync(join(dir, kind, `${name}.json`), JSON.stringify(group));
  }
  writeFileSync(join(dir, "bloodlines.json"), JSON.stringify({ releasers }));
  return new House(dir);
}

const catalog = [
  { name: "the-library-master:latest", family: "qwen2", parent: "deepseek-r1:7b" },
  { name: "deepseek-r1:7b", family: "qwen2", parent: null },
  { name: "child-of-file:latest", family: "llama", parent: "/vault/blobs/sha256-x" },
  { name: "sarverott/EON-alfa:latest", family: "llama", parent: "llama3.2:latest" },
];

test("bloodline follows parent_model to the root, and the root names the releaser", () => {
  const releasers = [
    { match: "deepseek", releaser: "DeepSeek" },
    { match: "llama", releaser: "Meta" },
  ];
  assert.deepEqual(rootOf(catalog, "the-library-master"), { name: "deepseek-r1:7b", family: "qwen2" });
  assert.deepEqual(bloodlineOf(catalog, releasers, "the-library-master"), {
    root: "deepseek-r1:7b",
    releaser: "DeepSeek",
  });
  assert.deepEqual(bloodlineOf(catalog, releasers, "sarverott/EON-alfa"), {
    root: "llama3.2:latest",
    releaser: "Meta",
  });
  assert.equal(bloodlineOf(catalog, releasers, "child-of-file").releaser, "llama (architecture)");
});

test("the real House: EON resting, Shakespeare adopted, RavensArmy with Skryba, Mythos and Sol", () => {
  const house = new House();
  assert.equal(house.stateOf("EON-beta___Chronus:latest").state, "resting");
  assert.match(house.stateOf("sarverott/Plutarhist").reason, /own decision/);
  assert.equal(house.stateOf("the-library-master___omnilibris-shakespeare-KFT_docs").group, "shakespeare");
  assert.equal(house.mayCall("tulu3:latest"), true);
  assert.equal(house.mayCall("some-unknown-model"), true);
  const army = house.orders().find((order) => order.name === "ravensarmy");
  assert.deepEqual(
    army.members.map((m) => [m.name, m.kind]),
    [
      ["skryba", "local"],
      ["Mythos", "remote"],
      ["Sol", "remote"],
    ],
  );
});

test("a member's own state wins over its group's", () => {
  const house = houseAt({ children: { keepers: { members: [{ model: "a" }, { model: "b", state: "frozen" }] } } });
  assert.equal(house.mayCall("a"), true);
  assert.equal(house.stateOf("b").state, "frozen");
  assert.equal(house.mayCall("b"), false);
});

test("gathering: presence, pattern claims, remote units, bloodlines by releaser", () => {
  const house = houseAt({
    children: {
      keepers: { members: [{ model: "the-library-master" }, { model: "gone" }] },
      sleepers: { state: "resting", patterns: ["EON"] },
    },
    orders: { army: { members: [{ name: "Mythos", kind: "remote" }] } },
    releasers: [
      { match: "deepseek", releaser: "DeepSeek" },
      { match: "llama", releaser: "Meta" },
    ],
  });
  const context = { house, children: house.children(), orders: house.orders(), catalog };
  mergeResidents(context);
  const byName = Object.fromEntries(context.children.map((g) => [g.name, g]));
  assert.deepEqual(
    byName.keepers.members.map((m) => [m.model, m.present, m.bloodline?.releaser]),
    [
      ["the-library-master", true, "DeepSeek"],
      ["gone", false, "unknown"],
    ],
  );
  assert.deepEqual(
    byName.sleepers.members.map((m) => [m.model, m.state]),
    [["sarverott/EON-alfa:latest", "resting"]],
  );
  assert.equal(context.orders.find((o) => o.name === "army").members[0].present, null);
  assert.deepEqual(Object.fromEntries(context.bloodlines.map((b) => [b.releaser, b.models.length])), {
    DeepSeek: 2,
    Meta: 1,
    "llama (architecture)": 1,
  });
});
