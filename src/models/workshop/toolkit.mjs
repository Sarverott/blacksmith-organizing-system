// Tools of the workshop: bos workshop <tool>
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { z } from "zod";

import { REPO_ROOT } from "../../core/self.mjs";
import { tool } from "../../core/toolkit.mjs";
import { modeByDigit } from "./modes.mjs";

const GLOSSARY = join(REPO_ROOT, "docs", "glossary");
const asStatus = (result, views) => new views.StatusView().text(result);
const dryRun = { dryRun: z.boolean().optional().describe("only list what would be created") };

export const toolkit = [
  tool({
    name: "locate",
    info: "active workshop, the rule that found it, where BOS sits, other workshops",
    run: ({ controllers }) => controllers.workshop.locate(),
    render: asStatus,
  }),
  tool({
    name: "status",
    info: "workshop tree and what is missing; role and mode of work",
    run: ({ controllers }) => controllers.workshop.status(),
    render: asStatus,
  }),
  tool({
    name: "glossary",
    info: "definition of a BOS element (forge, scope, sheme, mode, house, raven…); without a term, the list",
    input: { term: z.string().optional().describe("element name, e.g. forge") },
    positional: ["term"],
    run: ({ input }) => {
      if (!input.term)
        return readdirSync(GLOSSARY)
          .filter((f) => f.endsWith(".md"))
          .map((f) => f.slice(0, -3));
      const page = join(GLOSSARY, `${input.term.toLowerCase().replace(/[^a-z0-9-]/g, "")}.md`);
      return existsSync(page) ? readFileSync(page, "utf8") : `no glossary page for "${input.term}"`;
    },
    render: (result) => (Array.isArray(result) ? result.join("\n") : result),
  }),
  tool({
    name: "bootstrap",
    info: "create missing areas, descriptors and agent guides; never overwrites",
    mode: "conform",
    readOnly: false,
    input: dryRun,
    run: ({ controllers, input }) => controllers.workshop.bootstrap({ dryRun: Boolean(input.dryRun) }),
    render: asStatus,
  }),
  tool({
    name: "open",
    info: "bootstrap, then record the opening in storylines",
    mode: "conform",
    readOnly: false,
    input: dryRun,
    run: ({ controllers, input }) => controllers.workshop.open({ dryRun: Boolean(input.dryRun) }),
    render: asStatus,
  }),
  tool({
    name: "close",
    info: "keep the shell history as a ttystory, record the closing",
    mode: "conform",
    readOnly: false,
    run: ({ controllers }) => controllers.workshop.close(),
    render: (result) => `closed · ttystory: ${result.ttystory ?? "no shell history found"}`,
  }),
  tool({
    name: "sink",
    info: "inventory of what must be rescued from this workstation (read-only part of sinking)",
    mode: "almanac",
    run: ({ controllers }) => controllers.workshop.sink(),
    render: (result, views) => new views.InventoryView().text(result),
  }),
  tool({
    name: "mode",
    info: "switch the mode of work (1-5 or its name); without one, a menu that takes one digit",
    mode: "commandorate",
    readOnly: false,
    input: { mode: z.string().optional().describe("almanac, conform, smeltry, commandorate, provision, or 1-5") },
    positional: ["mode"],
    run: async ({ controllers, input, ask, views }) => {
      let asked = input.mode;
      if (asked === undefined) {
        if (!ask) throw new Error("name a mode: almanac, conform, smeltry, commandorate, provision (or 1-5)");
        const { config } = await controllers.workshop.status();
        const digit = await ask.digit(`${new views.ModeView().menu(config.mode)}choose 0-5: `, 5);
        if (!digit) return null;
        asked = modeByDigit(digit);
      }
      return controllers.workshop.mode(asked);
    },
    render: (result, views) => (result ? new views.ModeView().text(result) : ""),
  }),
];
