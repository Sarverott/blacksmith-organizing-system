// Make the workshop whole: every mandatory area and descriptor, plus the agent guides.
// Creates only what is missing; never overwrites.
import { copyFileSync } from "node:fs";
import { join } from "node:path";

import { BasicProcedure } from "../basic-procedure.mjs";
import { createIfMissing } from "../basic-model.mjs";
import { RESOURCES } from "../self.mjs";

export const AGENT_GUIDES = ["AGENTS.md", "CLAUDE.md"];

export const bootstrap = new BasicProcedure("bootstrap", [], {
  description: "create missing areas and descriptors of the workshop, deploy agent guides",
})
  .step("ensure workshop tree", (context) => {
    context.workshop.ensure(context);
  })
  .step("deploy agent guides", (context) => {
    for (const guide of AGENT_GUIDES) {
      const target = join(context.workshopRoot, guide);
      createIfMissing(target, () => copyFileSync(join(RESOURCES, "workshop-root", guide), target), context);
    }
  });
