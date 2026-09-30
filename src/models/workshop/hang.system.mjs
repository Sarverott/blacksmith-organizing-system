// .BOS: the folder where BOS keeps itself inside a workshop (glossary: system).
// Its contents hang on the workshop directly: workshop.setup, workshop.storylines…
import { writeFileSync } from "node:fs";

import { BOS } from "../../main.ts";
import { workshopTaskfile } from "./taskfile.mjs";

export class System extends BOS.Submodule {
  static type = "system";
  static ownerType = "workshop";
  static dirname = ".BOS";
  static descriptors = {
    "workshop.json": (element, context) => context.config ?? {},
    "Taskfile.yaml": workshopTaskfile,
  };

  // change some fields of workshop.json, keep every other one
  update(fields, context = {}) {
    const next = { ...this.readJSON("workshop.json", {}), ...fields };
    if (!context.dryRun) writeFileSync(this.file("workshop.json"), JSON.stringify(next, null, 2) + "\n");
    return next;
  }
}

export default System;
