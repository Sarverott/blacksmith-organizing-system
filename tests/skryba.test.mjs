import assert from "node:assert/strict";
import { test } from "vitest";

import { askSkryba, assemble } from "../src/procedures/describing/ask-skryba.mjs";
import { readRaven } from "../src/bridge/ollama-link/ravens.mjs";

const draft = "feat(procedures): add describing\n\nA src/procedures/describing/_index.mjs\n";
const fakeOllama = (answer, available = true) => ({
  raven: readRaven,
  available: async () => available,
  ask: async () => (typeof answer === "string" ? answer : JSON.stringify(answer)),
});

test("Skryba is a raven with a model, a duty and a prompt", () => {
  const skryba = readRaven("skryba");
  assert.equal(skryba.model, "llama3");
  assert.match(skryba.duty, /commit messages/);
  assert.match(skryba.system, /conventional commit/);
});

test("a good answer becomes a valid message that keeps the file list", () => {
  const message = assemble({ type: "feat", scope: "Procedures", subject: "let commits describe themselves.", body: "drafts from staged paths\n  refined by Skryba" }, draft, "Drafted-by: Skryba (llama3 via ollama)");
  assert.equal(message, "feat(procedures): let commits describe themselves\n\ndrafts from staged paths\nrefined by Skryba\n\nA src/procedures/describing/_index.mjs\n\nDrafted-by: Skryba (llama3 via ollama)\n");
});

test("a bad answer is refused", () => {
  assert.equal(assemble("not json", draft), null);
  assert.equal(assemble({ type: "feature", scope: "", subject: "x", body: "" }, draft), null);
  assert.equal(assemble({ type: "fix", scope: "", subject: "  ", body: "" }, draft), null);
});

test("Skryba refines the draft, or leaves it when he can't help", async () => {
  const run = async (ollama) => {
    const context = { options: { skryba: true, ollama }, message: draft, repo: process.cwd() };
    await askSkryba(context);
    return context;
  };
  const good = await run(fakeOllama({ type: "feat", scope: "procedures", subject: "let commits describe themselves", body: "why" }));
  assert.match(good.message, /^feat\(procedures\): let commits describe themselves\n\nwhy\n/);
  assert.equal(good.skryba.used, true);

  const absent = await run(fakeOllama(null, false));
  assert.equal(absent.message, draft);
  assert.match(absent.skryba.reason, /not available/);

  const confused = await run(fakeOllama("¯\\_(ツ)_/¯"));
  assert.equal(confused.message, draft);
});
