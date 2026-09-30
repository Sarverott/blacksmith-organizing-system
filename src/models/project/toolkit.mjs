// Tools of a project (the git repository around the current directory): bos project <tool>
import { z } from "zod";

import { tool } from "../../core/toolkit.mjs";

const cwd = { cwd: z.string().optional().describe("path inside the repository (default: current directory)") };

export const toolkit = [
  tool({
    name: "describe",
    info: "conventional-commit draft of what is staged (Skryba refines it with --skryba)",
    mode: "smeltry",
    input: { ...cwd, skryba: z.boolean().optional().describe("let Skryba the scribe raven refine it (up to 90 s)") },
    run: ({ controllers, input }) => controllers.repository.describe({ cwd: input.cwd, skryba: Boolean(input.skryba) }),
    render: (result) =>
      (result.message ?? "nothing staged") +
      (result.skryba && !result.skryba.used ? `\n# Skryba: ${result.skryba.reason}` : ""),
  }),
  tool({
    name: "prepare-message",
    info: "(git prepare-commit-msg) write the draft into the commit message of a plain `git commit`",
    mode: "smeltry",
    readOnly: false,
    input: {
      file: z.string().describe("commit message file"),
      source: z.string().optional().describe("git's message source"),
    },
    positional: ["file", "source"],
    run: ({ controllers, input }) => controllers.repository.describe({ file: input.file, source: input.source ?? "" }),
    render: () => "",
  }),
  tool({
    name: "plan",
    info: "plan moving the current branch one station: master → developement → revision → testing → releasing → master",
    mode: "smeltry",
    input: { ...cwd, reject: z.boolean().optional().describe("back to developement instead") },
    run: ({ controllers, input }) =>
      controllers.repository.promote({ cwd: input.cwd, reject: Boolean(input.reject), apply: false }),
    render: (result, views) => new views.PromotionView().text(result),
  }),
  tool({
    name: "promote",
    info: "move the current branch one station along the flow (releasing → master opens a pull request)",
    mode: "smeltry",
    readOnly: false,
    input: { ...cwd, reject: z.boolean().optional().describe("back to developement instead") },
    run: ({ controllers, input }) =>
      controllers.repository.promote({ cwd: input.cwd, reject: Boolean(input.reject), apply: true }),
    render: (result, views) => new views.PromotionView().text(result),
  }),
  tool({
    name: "install-hooks",
    info: "link this repository's git hooks to BOS storylines (skipped when e.g. husky manages them)",
    mode: "smeltry",
    readOnly: false,
    run: ({ controllers }) => controllers.repository.installHooks(),
    render: (result) => JSON.stringify({ installed: result.changes, skipped: result.skipped }, null, 2),
  }),
  tool({
    name: "hook",
    info: "(called by git) record a hook in the workshop's storylines",
    mode: "smeltry",
    readOnly: false,
    input: { name: z.string().describe("post-commit, post-checkout or post-merge") },
    positional: ["name"],
    run: ({ controllers, input }) => controllers.repository.hook(input.name),
    render: () => "",
  }),
  tool({
    name: "skills",
    info: "draft an agent skill for every BOS model that has none (in the BOS repository)",
    mode: "smeltry",
    readOnly: false,
    input: { dryRun: z.boolean().optional().describe("only list what would be drafted") },
    run: ({ controllers, input }) => controllers.repository.skills({ dryRun: Boolean(input.dryRun) }),
    render: (result, views) => new views.SkillsView().text(result),
  }),
  tool({
    name: "seal",
    info: "write the checksums of a directory into its manifest",
    mode: "conform",
    readOnly: false,
    input: { dir: z.string().optional().describe("directory (default: current)") },
    positional: ["dir"],
    run: ({ controllers, input }) => controllers.repository.seal(input.dir ?? "."),
    render: (result) => `sealed ${Object.keys(result.files).length} files`,
  }),
  tool({
    name: "verify",
    info: "compare a directory with its manifest: missing, changed, unlisted files",
    mode: "conform",
    input: { dir: z.string().optional().describe("directory (default: current)") },
    positional: ["dir"],
    run: ({ controllers, input }) => controllers.repository.verify(input.dir ?? "."),
    render: (result) => JSON.stringify(result, null, 2),
  }),
];
