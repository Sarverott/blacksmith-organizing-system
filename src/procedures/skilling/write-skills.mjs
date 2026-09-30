import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { createIfMissing } from "../../core/basic-element.mjs";

// skills/bos-<type>/SKILL.md, only where none exists yet
export const writeSkills = (context) => {
  for (const skill of context.skills) {
    const target = join(context.root, "skills", skill.name, "SKILL.md");
    skill.created = createIfMissing(target, () => {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, skill.text);
    }, context);
  }
};
