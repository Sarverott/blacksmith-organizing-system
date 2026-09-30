// .BOS/storylines: records of what happened (glossary: storylines).
// Not needed to launch; appears with the first recorded event.
import { appendFileSync } from "node:fs";

import { BOS } from "../../main.ts";
import Logs from "./hang.storylines.logs.mjs";
import Manifests from "./hang.storylines.manifests.mjs";
import Ttystories from "./hang.storylines.ttystories.mjs";

export class Storylines extends BOS.Submodule {
  static type = "storylines";
  static ownerType = "workshop";
  static dirname = ".BOS/storylines";
  static mandatory = false;
  static submodules = { ttystories: Ttystories, logs: Logs, manifests: Manifests };
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
    if (!context.dryRun) appendFileSync(this.logs.file("workshop.jsonl"), JSON.stringify(entry) + "\n");
    return entry;
  }

  ttystoryName({ env }) {
    return `ttystory-${env.host}-${env.unixusat}.txt`;
  }
}

export default Storylines;
