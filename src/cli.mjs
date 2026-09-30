#!/usr/bin/env node
// bos <command> [operands] [--json] [--dry-run] [--workshop=PATH]
import { BOS } from "./main.ts";

const args = process.argv.slice(2);
const flags = Object.fromEntries(
  args.filter((arg) => arg.startsWith("--")).map((arg) => {
    const [key, value = true] = arg.slice(2).split("=");
    return [key.replace(/-(\w)/g, (_, c) => c.toUpperCase()), value];
  })
);
const [name = "help", ...operands] = args.filter((arg) => !arg.startsWith("--"));

try {
  const bos = await new BOS({ workshop: flags.workshop }).load();
  const output = await bos.command(name, operands, flags);
  if (output !== undefined) console.log(typeof output === "string" ? output : JSON.stringify(output, null, 2));
} catch (error) {
  console.error(`bos ${name}: ${error.message}${error.procedure ? `\n  in ${error.procedure}` : ""}`);
  process.exitCode = 1;
}
