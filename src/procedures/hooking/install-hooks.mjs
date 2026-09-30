import { chmodSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import GitClient from "../../bridge/git-client/_index.mjs";
import { createIfMissing } from "../../core/basic-element.mjs";
import { CLI } from "../../core/self.mjs";
import { HOOKS } from "./hooks.mjs";

// link a repository's hooks to `bos project hook <name>`; someone's own hook is left alone
export const installHooks = async (context) => {
  const git = new GitClient();
  const root = await git.root(context.env.cwd);
  if (!root) throw new Error("not inside a git repository");
  context.skipped = [];
  // hooks managed elsewhere (e.g. husky sets core.hooksPath): those hooks should call `bos hook <name>` themselves
  const managed = await git.hooksPath(root);
  if (managed) {
    context.managedBy = managed;
    context.skipped.push(`all: core.hooksPath is ${managed}`);
    return;
  }
  for (const hook of Object.keys(HOOKS)) {
    const target = join(root, ".git", "hooks", hook);
    if (existsSync(target)) context.skipped.push(target);
    createIfMissing(
      target,
      () => {
        writeFileSync(target, `#!/bin/sh\nexec node "${CLI}" project hook ${hook} "$@"\n`);
        chmodSync(target, 0o755);
      },
      context,
    );
  }
};
