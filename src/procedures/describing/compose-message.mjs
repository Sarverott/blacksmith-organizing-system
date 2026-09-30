// A conventional-commit draft from the staged changes alone: deterministic, no guessing beyond paths.
import { scopeOf, targetOf } from "./scopes.mjs";

const ONLY = { docs: "docs", tests: "test", ci: "ci", build: "build" };
const MARK = { added: "A", modified: "M", deleted: "D" };

export function composeMessage(staged) {
  if (!staged.length) return null;
  const scopes = [...new Set(staged.map(([path]) => scopeOf(path)))];
  const states = new Set(staged.map(([, state]) => state));
  const addsCode = staged.some(([path, state]) => state === "added" && path.startsWith("src/"));
  const type = scopes.length === 1 && ONLY[scopes[0]] ? ONLY[scopes[0]] : addsCode ? "feat" : "chore";
  const scope = scopes.length <= 2 ? `(${scopes.join(",")})` : "";
  const verb = states.size === 1 ? { added: "add", deleted: "remove", modified: "update" }[[...states][0]] : "update";
  const targets = [...new Set(staged.map(([path]) => targetOf(path)))];
  const named = targets.slice(0, 3).join(", ") + (targets.length > 3 ? ` +${targets.length - 3} more` : "");
  const header = `${type}${scope}: ${verb} ${named}`.slice(0, 100);
  const body = staged.slice(0, 40).map(([path, state]) => `${MARK[state]} ${path}`);
  if (staged.length > 40) body.push(`… ${staged.length - 40} more files`);
  return `${header}\n\n${body.join("\n")}\n`;
}

export const composeDraft = (context) => {
  context.message = composeMessage(context.staged);
};
