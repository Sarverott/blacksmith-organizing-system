// A bridge wraps an outside tool (git, docker, gh, task, ...) behind one call shape.
import { execFileSync, spawnSync } from "node:child_process";

export class BasicBridge {
  constructor(command, { versionArgs = ["--version"] } = {}) {
    this.command = command;
    this.versionArgs = versionArgs;
  }

  available() {
    return spawnSync(this.command, this.versionArgs, { stdio: "ignore" }).status === 0;
  }

  run(args, { cwd = process.cwd(), inherit = false } = {}) {
    const output = execFileSync(this.command, args, {
      cwd,
      encoding: "utf8",
      stdio: inherit ? "inherit" : ["ignore", "pipe", "pipe"],
    });
    return typeof output === "string" ? output.trim() : "";
  }

  // like run, but null instead of throwing
  try(args, options) {
    try {
      return this.run(args, options);
    } catch {
      return null;
    }
  }
}

export const git = new BasicBridge("git");
export const gh = new BasicBridge("gh");
export const docker = new BasicBridge("docker");
