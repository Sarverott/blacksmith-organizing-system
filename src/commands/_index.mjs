/*
based on index.json in dirs generate commands
{
    "path": "/status", # url path for apis
    "info": "status information", # shortest explanation
    "help": ["./help.md", "MD"], # detailed usage with render filetype handling
    "inline": "./exec.mjs", # when called as oneline command with subcommand to return output to standard output, if it is streamable command then piping of input-output should be also handled there somewhere... it can be splitted to another file but have to be imported later
    "repl": "./repl.mjs" # interactive cli menu that allows standard input of choice or more advanced nice-looking terminal gui based on universal ascii base
}
not all of these are required, most minimalistic now is "help" - only show universal help on general error or invoking help
should list commands and what they does
*/

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

// "./exec.mjs" → a function that imports the module on first call and runs its default export
const lazy = (dir, file) => async (context) => (await import(pathToFileURL(join(dir, file)))).default(context);

export function loadCommand(dir, name = dir.split("/").pop()) {
  const index = JSON.parse(readFileSync(join(dir, "index.json"), "utf8"));
  const [helpFile, helpType = "MD"] = [].concat(index.help ?? []);
  return {
    name,
    path: index.path ?? `/${name}`,
    info: index.info ?? "",
    help: () => (helpFile && existsSync(join(dir, helpFile)) ? { text: readFileSync(join(dir, helpFile), "utf8"), type: helpType } : null),
    inline: index.inline ? lazy(dir, index.inline) : async () => { throw new Error(`${name} has no inline form; see: bos help ${name}`); },
    repl: index.repl ? lazy(dir, index.repl) : null,
  };
}

export async function loadCommands(root = HERE) {
  return Object.fromEntries(
    readdirSync(root, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && existsSync(join(root, entry.name, "index.json")))
      .map((entry) => [entry.name, loadCommand(join(root, entry.name), entry.name)])
  );
}

