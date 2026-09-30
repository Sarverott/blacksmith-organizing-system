// Interactive BOS: `<model> <tool> [operands]` at a prompt, `help`, `exit`.
import readline from "node:readline/promises";

import { parseArgs } from "../../core/toolkit.mjs";
import { header, paint } from "../terminal/paint.mjs";

export async function startRepl(bos) {
  const io = readline.createInterface({ input: process.stdin, output: process.stdout });
  // inside the repl the prompt owns the keyboard: a digit is confirmed with Enter
  const ask = { digit: async (prompt, max) => Math.min(Number((await io.question(prompt)).trim()[0]) || 0, max) };
  console.log(header("BOS repl"), paint.dim("· <model> <tool> · help · exit"));
  io.setPrompt(paint.yellow("⚒ bos › "));
  io.prompt();
  for await (const line of io) {
    const args = line.trim().split(/\s+/).filter(Boolean);
    if (args[0] === "exit" || args[0] === "quit") break;
    try {
      if (args[0] === "help")
        console.log(
          new bos.views.HelpView().text({ tools: bos.execution.tools, ask: parseArgs(args.slice(1)).operands }),
        );
      else if (args.length) {
        const output = await bos.run(args, { ask });
        if (output) console.log(output);
      }
    } catch (error) {
      console.log(paint.red(error.message));
    }
    io.prompt();
  }
  io.close();
}
