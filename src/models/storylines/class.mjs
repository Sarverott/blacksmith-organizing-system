// Records of what happened: ttystories, logs, manifests (glossary: storylines).
// Not needed to launch; appears with the first recorded event.
import { appendFileSync } from "node:fs";

import { BOS } from "../../main.ts";

const area = (type) => class extends BOS.Model {
  static type = type;
  static dirname = type;
};

export class Storylines extends BOS.Model {
  static type = "storylines";
  static dirname = "storylines";
  static mandatory = false;
  static children = [area("ttystories"), area("logs"), area("manifests")];
  static descriptors = {
    "metadata.json": (element, context) => ({
      origin: {
        host: context.env?.host ?? null,
        user: context.env?.user ?? null,
        unixusat: context.env?.unixusat ?? Date.now(),
        createdBy: "blacksmith-organizing-system",
      },
    }),
  };

  // one JSON line per event: opening, closing, git hooks…
  record(event, context = {}) {
    const entry = { unixusat: Date.now(), host: context.env?.host ?? null, ...event };
    if (!context.dryRun) appendFileSync(this.file("logs", "workshop.jsonl"), JSON.stringify(entry) + "\n");
    return entry;
  }

  ttystoryName({ env }) {
    return `ttystory-${env.host}-${env.unixusat}.txt`;
  }
}

export default Storylines;
