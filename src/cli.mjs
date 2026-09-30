#!/usr/bin/env node
import { VERSION } from "./core/self.mjs";
// bos <model> <tool> [operands] [--flags]   ·   bos help [model [tool]]   ·   bos repl   ·   bos --version
import { parseArgs } from "./core/toolkit.mjs";
import { BOS } from "./main.ts";

const args = process.argv.slice(2);
const { operands, flags } = parseArgs(args);

try {
  if (flags.version) {
    console.log(VERSION);
  } else {
    const bos = await new BOS({ workshop: flags.workshop }).load();
    const [first] = operands;
    let output;
    if (!first || first === "help")
      output = new bos.views.HelpView().text({ tools: bos.execution.tools, ask: operands.slice(1) });
    else if (first === "repl") await bos.views.startRepl(bos);
    else output = await bos.run(args, { ask: { digit: bos.views.chooseDigit } });
    if (output) console.log(output);
  }
} catch (error) {
  console.error(
    `bos ${operands.slice(0, 2).join(" ")}: ${error.message}${error.procedure ? `\n  in ${error.procedure}` : ""}`,
  );
  process.exitCode = 1;
}
