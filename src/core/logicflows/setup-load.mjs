// Load the workshop definition: resources defaults, overridden by .BOS/workshop.json.
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { BasicProcedure } from "../basic-procedure.mjs";
import { RESOURCES } from "../self.mjs";
import { HOST_ROLES, Workshop } from "../../models/class.mjs";

export const setupLoad = new BasicProcedure("setup-load", [], {
  description: "load workshop.json over the defaults and validate it",
})
  .step("load workshop config", (context) => {
    const defaults = JSON.parse(readFileSync(join(RESOURCES, "workshop.default.json"), "utf8"));
    context.workshop = new Workshop(context.workshopRoot);
    context.config = { ...defaults, ...context.workshop.system.readJSON("workshop.json", {}) };
  })
  .step("validate host role", (context) => {
    const { role } = context.config;
    if (role && !(role in HOST_ROLES)) {
      throw new Error(`unknown host role "${role}" in workshop.json (known: ${Object.keys(HOST_ROLES).join(", ")})`);
    }
  });
