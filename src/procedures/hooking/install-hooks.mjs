import { chmodSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import GitClient from "../../bridge/git-client/_index.mjs";
import { createIfMissing } from "../../core/basic-model.mjs";
import { CLI } from "../../core/self.mjs";
import { HOOKS } from "./hooks.mjs";

// link a repository's hooks to `bos hook <name>`; someone's own hook is left alone
export const installHooks = async (context) => {
  const root = await new GitClient().root(context.env.cwd);
  if (!root) throw new Error("not inside a git repository");
  context.skipped = [];
  for (const hook of Object.keys(HOOKS)) {
    const target = join(root, ".git", "hooks", hook);
    if (existsSync(target)) context.skipped.push(target);
    createIfMissing(target, () => {
      writeFileSync(target, `#!/bin/sh\nexec node "${CLI}" hook ${hook} "$@"\n`);
      chmodSync(target, 0o755);
    }, context);
  }
};
