import { readFileSync } from "node:fs";
import { join } from "node:path";

import { RESOURCES } from "../../core/self.mjs";
import Workshop from "../../models/workshop/class.mjs";

// resources defaults, overridden by .BOS/workshop.json
export const loadConfig = (context) => {
  const defaults = JSON.parse(readFileSync(join(RESOURCES, "workshop.default.json"), "utf8"));
  context.workshop = new Workshop(context.workshopRoot);
  context.config = { ...defaults, ...context.workshop.system.readJSON("workshop.json", {}) };
};
