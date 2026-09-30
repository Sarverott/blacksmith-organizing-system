// Publishing a package to npm. Dry run unless told otherwise.
import { BOS } from "../../main.ts";
import SubprocessRunner from "../subprocess-runner/_index.mjs";

const npm = new SubprocessRunner({ command: "npm" });

export class NpmPublish extends BOS.Bridge {
  static id = "npm-publish";

  available() {
    return npm.available();
  }

  publish(dir, { dryRun = true, tag = "latest" } = {}) {
    return npm.run("npm", ["publish", "--tag", tag, ...(dryRun ? ["--dry-run"] : [])], { cwd: dir, inherit: true });
  }
}

export default NpmPublish;
