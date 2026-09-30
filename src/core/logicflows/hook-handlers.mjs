// Git hooks of any repository inside the workshop report to storylines.
// `bos hooks install` links a repository's hooks to `bos hook <name>`.
import { chmodSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { BasicProcedure } from "../basic-procedure.mjs";
import { createIfMissing } from "../basic-model.mjs";
import { git } from "../basic-bridge.mjs";
import { CLI } from "../self.mjs";
import { envRead, placeOf } from "./env-read.mjs";
import { setupLoad } from "./setup-load.mjs";

// what each hook adds to its storyline entry
export const HOOKS = {
  "post-commit": (cwd) => ({ commit: git.try(["log", "-1", "--format=%H %s"], { cwd }) }),
  "post-checkout": (cwd) => ({ branch: git.try(["branch", "--show-current"], { cwd }) }),
  "post-merge": (cwd) => ({ head: git.try(["rev-parse", "HEAD"], { cwd }) }),
};

const handling = new BasicProcedure("handling").step("record hook", (context) => {
  const hook = context.options.hook;
  if (!(hook in HOOKS)) throw new Error(`unhandled hook "${hook}" (known: ${Object.keys(HOOKS).join(", ")})`);
  const repo = git.try(["rev-parse", "--show-toplevel"], { cwd: context.env.cwd }) ?? context.env.cwd;
  const storylines = context.workshop.storylines.ensure(context);
  context.event = storylines.record(
    { event: "git-hook", hook, repo, place: placeOf(repo, context.workshopRoot), ...HOOKS[hook](repo) },
    context
  );
});

const installing = new BasicProcedure("installing").step("link hooks", (context) => {
  const hooksDir = git.try(["rev-parse", "--git-path", "hooks"], { cwd: context.env.cwd });
  if (!hooksDir) throw new Error("not inside a git repository");
  const dir = join(context.env.cwd, hooksDir);
  context.skipped = [];
  for (const hook of Object.keys(HOOKS)) {
    const target = join(dir, hook);
    if (existsSync(target)) context.skipped.push(target); // someone's own hook: leave it
    createIfMissing(target, () => {
      writeFileSync(target, `#!/bin/sh\nexec node "${CLI}" hook ${hook} "$@"\n`);
      chmodSync(target, 0o755);
    }, context);
  }
});

export const handleHook = envRead.chain(setupLoad).chain(handling, "handle-hook");
export const installHooks = envRead.chain(installing, "install-hooks");
