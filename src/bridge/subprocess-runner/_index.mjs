// Any command-line tool as a bridge: run it, or ask whether it is installed.
import { execFileSync, spawnSync } from "node:child_process";

import { BOS } from "../../main.ts";

export class SubprocessRunner extends BOS.Bridge {
  static id = "subprocess-runner";

  async available(command = this.options.command) {
    if (!command) return false;
    return spawnSync(command, ["--version"], { stdio: "ignore" }).status === 0;
  }

  run(command, args = [], { cwd = process.cwd(), inherit = false } = {}) {
    const output = execFileSync(command, args, {
      cwd,
      encoding: "utf8",
      stdio: inherit ? "inherit" : ["ignore", "pipe", "pipe"],
    });
    return typeof output === "string" ? output.trim() : "";
  }

  // like run, but null instead of throwing
  try(command, args, options) {
    try {
      return this.run(command, args, options);
    } catch {
      return null;
    }
  }
}

export default SubprocessRunner;
