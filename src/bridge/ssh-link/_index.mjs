// Other hosts over ssh; aliases come from ~/.ssh/config (glossary: setup).
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

import { BOS } from "../../main.ts";
import SubprocessRunner from "../subprocess-runner/_index.mjs";

const ssh = new SubprocessRunner({ command: "ssh" });

export class SshLink extends BOS.Bridge {
  static id = "ssh-link";

  available() {
    return Promise.resolve(ssh.try("ssh", ["-V"]) !== null);
  }

  aliases(config = join(homedir(), ".ssh", "config")) {
    try {
      return [...readFileSync(config, "utf8").matchAll(/^\s*Host\s+(.+)$/gim)]
        .flatMap((match) => match[1].split(/\s+/))
        .filter((alias) => !alias.includes("*"));
    } catch {
      return [];
    }
  }

  run(host, command) {
    return ssh.run("ssh", ["-o", "BatchMode=yes", host, command]);
  }
}

export default SshLink;
