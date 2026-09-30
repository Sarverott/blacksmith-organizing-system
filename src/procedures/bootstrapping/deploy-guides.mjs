import { copyFileSync } from "node:fs";
import { join } from "node:path";

import { createIfMissing } from "../../core/basic-model.mjs";
import { RESOURCES } from "../../core/self.mjs";

export const AGENT_GUIDES = ["AGENTS.md", "CLAUDE.md"];

// the workshop-root guides for AI agents; an existing one is never replaced
export const deployGuides = (context) => {
  for (const guide of AGENT_GUIDES) {
    const target = join(context.workshopRoot, guide);
    createIfMissing(target, () => copyFileSync(join(RESOURCES, "workshop-root", guide), target), context);
  }
};
