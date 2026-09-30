import { readFileSync, writeFileSync } from "node:fs";

// prepare-commit-msg: fill the editor only for a plain `git commit`, never over a
// message given with -m, a merge, a squash or an amend
const KEEP = new Set(["message", "merge", "squash", "commit"]);

export const writeMessage = (context) => {
  const { file, source } = context.options;
  if (!file || !context.message || KEEP.has(source)) return;
  const current = readFileSync(file, "utf8");
  if (current.split("\n").some((line) => line.trim() && !line.startsWith("#"))) return;
  const hint = "# drafted by BOS from the staged changes: edit the type, scope and subject freely\n";
  if (!context.dryRun) writeFileSync(file, context.message + hint + current);
  context.written = file;
};
