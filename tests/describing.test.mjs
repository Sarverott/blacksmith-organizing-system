import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "vitest";
import { bridges } from "../src/index.mjs";
import { composeMessage } from "../src/procedures/describing/compose-message.mjs";
import { sandbox } from "./helpers.mjs";

test("drafts follow the staged paths", () => {
  assert.equal(composeMessage([]), null);
  assert.match(
    composeMessage([["docs/glossary/mode.md", "modified"]]),
    /^docs\(docs\): update mode\n\nM docs\/glossary\/mode\.md\n$/,
  );
  assert.match(
    composeMessage([
      ["src/procedures/describing/_index.mjs", "added"],
      ["src/procedures/describing/scopes.mjs", "added"],
    ]),
    /^feat\(procedures\): add describing\n/,
  );
  assert.match(composeMessage([["tests/a.test.mjs", "modified"]]), /^test\(tests\): update a\.test/);
  assert.match(
    composeMessage([
      ["src/models/forge/class.mjs", "modified"],
      ["package.json", "modified"],
    ]),
    /^chore\(models,build\): update forge, package/,
  );
  assert.match(
    composeMessage([
      ["src/a/x/1.mjs", "modified"],
      ["docs/b.md", "modified"],
      [".github/c.yml", "deleted"],
    ]),
    /^chore: update x, b, c\n/,
  );
});

test("prepare-commit-msg fills only a plain commit", async () => {
  const { root, bos } = await sandbox();
  const repo = join(root, "forge/scope/project");
  mkdirSync(repo, { recursive: true });
  const git = new bridges.gitClient();
  await git.init(repo);
  writeFileSync(join(repo, "README.md"), "# project\n");
  await git.commit(repo, "docs: start");
  writeFileSync(join(repo, "README.md"), "# project\nmore\n");
  mkdirSync(join(repo, "src/procedures/forging"), { recursive: true });
  writeFileSync(join(repo, "src/procedures/forging/_index.mjs"), "export default 1;\n");
  for (const path of ["README.md", "src/procedures/forging/_index.mjs"])
    await (await import("isomorphic-git")).default.add({ fs: await import("node:fs"), dir: repo, filepath: path });

  const file = join(root, "COMMIT_EDITMSG");
  writeFileSync(file, "\n# Please enter the commit message\n");
  await bos.repository.describe({ cwd: repo, file, source: "" });
  const drafted = readFileSync(file, "utf8");
  assert.match(
    drafted,
    /^feat\(repo,procedures\): update README, forging\n\nM README\.md\nA src\/procedures\/forging\/_index\.mjs\n# drafted by BOS/,
  );

  writeFileSync(file, "fix: my own words\n");
  await bos.repository.describe({ cwd: repo, file, source: "message" });
  assert.equal(readFileSync(file, "utf8"), "fix: my own words\n");
});
