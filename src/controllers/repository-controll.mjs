// Remote of a git repository (the project around the current directory): commits,
// the branch flow, hooks, manifests, and the BOS repository's own skills.
import { resolve } from "node:path";

import { BOS } from "../main.ts";
import procedures from "../procedures/_index.mjs";

export class RepositoryControll extends BOS.Controll {
  static flows = procedures;

  describe(options) {
    return this.run("describing", options);
  }
  promote({ cwd, reject = false, apply = false } = {}) {
    return this.run("promoting", { cwd, reject, dryRun: !apply });
  }
  installHooks() {
    return this.run("installingHooks");
  }
  hook(hook) {
    return this.run("hooking", { hook, dryRun: false });
  }
  skills(options) {
    return this.run("skilling", options);
  }
  seal(dir, { dryRun = false } = {}) {
    return new BOS.Model(resolve(dir)).seal({ dryRun });
  }
  verify(dir) {
    return new BOS.Model(resolve(dir)).verify();
  }
}

export default RepositoryControll;
