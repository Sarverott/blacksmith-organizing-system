// Interactive BOS: every command at a prompt. A command with its own repl.mjs
// gets the prompt to ask questions; others print their inline output.
import readline from "node:readline/promises";

import { header, paint } from "../terminal/paint.mjs";

export async function startRepl(bos) {
  const io = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log(header("BOS repl"), paint.dim("· help · exit"));
  io.setPrompt(paint.yellow("⚒ bos › "));
  io.prompt();
  for await (const line of io) {
    const [name, ...operands] = line.trim().split(/\s+/).filter(Boolean);
    if (name === "exit" || name === "quit") break;
    if (name) {
      try {
        const command = bos.commands[name];
        if (!command) throw new Error(`unknown command "${name}"`);
        const output = command.repl
          ? await command.repl({ bos, operands, flags: bos.options, io })
          : await command.inline({ bos, operands, flags: bos.options });
        if (output) console.log(typeof output === "string" ? output : JSON.stringify(output, null, 2));
      } catch (error) {
        console.log(paint.red(error.message));
      }
    }
    io.prompt();
  }
  io.close();
}
