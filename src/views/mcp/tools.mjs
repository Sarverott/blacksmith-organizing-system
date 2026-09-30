// BOS as MCP tools: what an AI agent may ask the workshop. All read-only: agents look and
// plan through MCP; changing the workshop stays a conscious act on the command line.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { z } from "zod";

import { REPO_ROOT } from "../../core/self.mjs";

const GLOSSARY = join(REPO_ROOT, "docs", "glossary");
const readOnly = { readOnlyHint: true, destructiveHint: false, openWorldHint: false };

export const TOOLS = [
  {
    name: "bos_locate",
    description:
      "Active BOS workshop (~/__WORKSHOP or /media/**/__WORKSHOP), the rule that found it, and where BOS itself sits.",
    input: {},
    run: async (bos) => bos.command("locate"),
  },
  {
    name: "bos_status",
    description:
      "Workshop tree (.BOS, devarmory, forge, craftbook, archive): what exists and what is missing; role and mode of work.",
    input: {},
    run: async (bos) => bos.command("status"),
  },
  {
    name: "bos_house",
    description:
      "The House of Anubis: adopted children, orders (RavensArmy…), bloodlines of every served model, and each resident's state. Resting residents must never be called.",
    input: { all: z.boolean().optional().describe("also list every model per bloodline") },
    run: async (bos, { all }) => bos.command("house", [], { all: Boolean(all) }),
  },
  {
    name: "bos_glossary",
    description:
      "Definition of a BOS element (workshop, forge, scope, sheme, sarcophag, mode, house, raven…) from docs/glossary; without a term, the list of pages.",
    input: { term: z.string().optional().describe("element name, e.g. forge") },
    run: async (_bos, { term }) => {
      if (!term)
        return readdirSync(GLOSSARY)
          .filter((f) => f.endsWith(".md"))
          .map((f) => f.slice(0, -3))
          .join("\n");
      const page = join(GLOSSARY, `${term.toLowerCase().replace(/[^a-z0-9-]/g, "")}.md`);
      return existsSync(page) ? readFileSync(page, "utf8") : `no glossary page for "${term}"`;
    },
  },
  {
    name: "bos_describe",
    description:
      "Conventional-commit draft for what is staged in a git repository (deterministic; Skryba the scribe raven only when asked, it may take up to 90 s).",
    input: {
      cwd: z.string().describe("path inside the repository"),
      skryba: z.boolean().optional().describe("let Skryba refine the draft through ollama"),
    },
    run: async (bos, { cwd, skryba }) =>
      (await bos.workshop.describe({ cwd, skryba: Boolean(skryba) })).message ?? "nothing staged",
  },
  {
    name: "bos_promote_plan",
    description:
      "Plan (never apply) moving a repository's current branch one station along the flow master → developement → revision → testing → releasing → master.",
    input: { cwd: z.string().describe("path inside the repository"), reject: z.boolean().optional() },
    run: async (bos, { cwd, reject }) => {
      const context = await bos.workshop.run("promoting", { cwd, reject: Boolean(reject), dryRun: true });
      return new bos.views.PromotionView().text(context);
    },
  },
  {
    name: "bos_sink_inventory",
    description:
      "Read-only inventory for the sinking protocol: every forge project with branch and uncommitted changes, and the ttystories.",
    input: {},
    run: async (bos) => bos.command("sink"),
  },
  {
    name: "bos_help",
    description:
      "BOS commands grouped by mode of work (ALMANAC, CONFORM, SMELTRY, COMMANDORATE, PROVISION), or the help of one command.",
    input: { command: z.string().optional() },
    run: async (bos, { command }) => bos.command("help", command ? [command] : []),
  },
];

export const READ_ONLY = readOnly;
