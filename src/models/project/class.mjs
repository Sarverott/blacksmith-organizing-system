// One concrete project repository (glossary: project).
import { existsSync } from "node:fs";

import { BOS } from "../../main.ts";
import { ANATOMY } from "./anatomy.mjs";

export class Project extends BOS.Model {
  static type = "project";
  static anatomy = ANATOMY;

  anatomyCheck() {
    const parts = Object.keys(ANATOMY);
    return {
      present: parts.filter((part) => existsSync(this.file(part))),
      missing: parts.filter((part) => !existsSync(this.file(part))),
    };
  }
}

export default Project;
