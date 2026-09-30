#!/usr/bin/env node
// bos <command> [--json] [--dry-run] [--workshop=PATH]
import { resolve } from "node:path";

import { BasicModel } from "./core/basic-model.mjs";
import { BRANCHES } from "./core/logicflows/ci-cd.mjs";
import { WorkshopControll } from "./controllers/workshop-controll.mjs";
import { StatusView } from "./views/status.mjs";

const HELP = `bos: Blacksmith Organization System

  bos locate                 active workshop, how it was found, where BOS sits
  bos status                 workshop tree and what is missing (read-only)
  bos bootstrap [--dry-run]  create missing areas, descriptors and agent guides
  bos open [--dry-run]       bootstrap + record the opening in storylines
  bos close                  capture shell history as ttystory + record closing
  bos seal <dir>             write checksums of <dir> into its manifest
  bos verify <dir>           compare <dir> with its manifest
  bos hooks install          link this repository's git hooks to BOS
  bos hook <name>            (called by git) record a hook in storylines
  bos promote [--reject] [--apply]
                             move the current branch one station along the flow

options: --json  --dry-run  --workshop=PATH`;

const args = process.argv.slice(2);
const flags = Object.fromEntries(
  args.filter((arg) => arg.startsWith("--")).map((arg) => {
    const [key, value = true] = arg.slice(2).split("=");
    return [key.replace(/-(\w)/g, (_, c) => c.toUpperCase()), value];
  })
);
const [command = "help", ...operands] = args.filter((arg) => !arg.startsWith("--"));
const format = flags.json ? "json" : "text";
const controll = new WorkshopControll({ workshop: flags.workshop, dryRun: Boolean(flags.dryRun) });
const print = (value) => console.log(typeof value === "string" ? value : JSON.stringify(value, null, 2));
const view = new StatusView();

const COMMANDS = {
  help: () => print(HELP),
  locate: async () => {
    const context = await controll.run("locate");
    print(format === "json" ? view.render(context, "json") : view.text(context));
  },
  status: async () => print(view.render(await controll.run("status"), format)),
  bootstrap: async () => print(view.render(await controll.run("bootstrap"), format)),
  open: async () => print(view.render(await controll.run("open"), format)),
  close: async () => {
    const context = await controll.run("close");
    print(format === "json" ? context.event : `closed; ttystory: ${context.ttystory ?? "no shell history found"}`);
  },
  seal: ([dir = "."]) => {
    const manifest = new BasicModel(resolve(dir)).seal({ dryRun: Boolean(flags.dryRun) });
    print(format === "json" ? manifest : `sealed ${Object.keys(manifest.files).length} files`);
  },
  verify: ([dir = "."]) => {
    const result = new BasicModel(resolve(dir)).verify();
    print(result);
    process.exitCode = result.ok ? 0 : 1;
  },
  hooks: async ([action]) => {
    if (action !== "install") throw new Error("usage: bos hooks install");
    const context = await controll.run("hooks-install");
    print({ installed: context.changes, skipped: context.skipped });
  },
  hook: async ([name]) => {
    await controll.run("hook", { hook: name, dryRun: false });
  },
  promote: async () => {
    const context = await controll.run("promote", { reject: Boolean(flags.reject), dryRun: !flags.apply });
    print(format === "json" ? { from: context.from, to: context.to, plan: context.plan } : [
      `${context.from} → ${context.to}  (${BRANCHES[context.to]})`,
      ...context.plan.map((step) => `  ${step.join(" ")}`),
      context.dryRun ? "dry run: add --apply to execute" : "applied",
    ].join("\n"));
  },
};

try {
  if (!(command in COMMANDS)) throw new Error(`unknown command "${command}"\n\n${HELP}`);
  await COMMANDS[command](operands);
} catch (error) {
  console.error(`bos ${command}: ${error.message}${error.procedure ? `\n  in ${error.procedure}` : ""}`);
  process.exitCode = 1;
}
