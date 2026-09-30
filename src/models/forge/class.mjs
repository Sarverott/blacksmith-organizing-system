// Active work, the desk: scopes of projects (glossary: forge).
import { readdirSync } from "node:fs";

import { BOS } from "../../main.ts";
import Scope from "../scope/class.mjs";

export class Forge extends BOS.Model {
  static type = "forge";
  static dirname = "forge";

  scopes() {
    if (!this.exists()) return [];
    return readdirSync(this.path, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
      .map((entry) => new Scope(this.file(entry.name), this));
  }
}

export default Forge;
