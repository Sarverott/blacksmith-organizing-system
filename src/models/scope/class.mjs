// A private repository holding a family of projects, shemes and one throwbox (glossary: scope).
import { existsSync, readdirSync } from "node:fs";

import { BOS } from "../../main.ts";
import Project from "../project/class.mjs";

export class Scope extends BOS.Model {
  static type = "scope";

  // every directory inside that is a git repository counts as a project
  projects() {
    if (!this.exists()) return [];
    return readdirSync(this.path, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && existsSync(this.file(entry.name, ".git")))
      .map((entry) => new Project(this.file(entry.name), this));
  }
}

export default Scope;
