import { readFileSync } from "node:fs";
import { join } from "node:path";

import { RESOURCES } from "../../core/self.mjs";
import Workshop from "../../models/workshop/class.mjs";

// resources defaults, overridden by .BOS/workshop.json; a null there means "not set", so the default applies
export const loadConfig = (context) => {
  const defaults = JSON.parse(readFileSync(join(RESOURCES, "workshop.default.json"), "utf8"));
  context.workshop = new Workshop(context.workshopRoot);
  const own = Object.fromEntries(
    Object.entries(context.workshop.system.readJSON("workshop.json", {})).filter(([, value]) => value !== null),
  );
  context.config = { ...defaults, ...own };
  context.defaulted = Object.keys(defaults).filter((key) => !(key in own) && defaults[key] !== null);
};
