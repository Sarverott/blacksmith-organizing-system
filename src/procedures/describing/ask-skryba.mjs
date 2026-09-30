// Skryba, the scribe raven (resources/ravens/skryba.md), rewrites the draft's header
// and adds a short body. He only proposes: the file list stays, and without ollama,
// or with a bad answer, the deterministic draft is used as it is.
import OllamaLink from "../../bridge/ollama-link/_index.mjs";
import SubprocessRunner from "../../bridge/subprocess-runner/_index.mjs";
import { stagedDiff } from "./staged-diff.mjs";

export const TYPES = ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert"];

export const ANSWER = {
  type: "object",
  properties: {
    type: { type: "string", enum: TYPES },
    scope: { type: "string" },
    subject: { type: "string" },
    body: { type: "string" },
  },
  required: ["type", "scope", "subject", "body"],
};

// Skryba's answer + the draft → a message; null when the answer can't be trusted
export function assemble(answer, draft, signature) {
  let parsed;
  try {
    parsed = typeof answer === "string" ? JSON.parse(answer) : answer;
  } catch {
    return null;
  }
  const subject = String(parsed?.subject ?? "")
    .trim()
    .replace(/\.$/, "");
  if (!TYPES.includes(parsed?.type) || !subject) return null;
  const scope = String(parsed.scope ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9,._-]/g, "");
  const header = `${parsed.type}${scope ? `(${scope})` : ""}: ${subject}`.slice(0, 100);
  const body = String(parsed.body ?? "")
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
  const files = draft.split("\n\n").slice(1).join("\n\n").trim();
  return `${[header, body, files, signature].filter(Boolean).join("\n\n")}\n`;
}

export const askSkryba = async (context) => {
  const wanted = context.options.skryba ?? process.env.BOS_SKRYBA !== "0";
  if (!wanted || !context.message) return;
  const ollama = context.options.ollama ?? new OllamaLink();
  const raven = ollama.raven("skryba");
  const model = process.env.BOS_SKRYBA_MODEL ?? raven.model;
  if (!(await ollama.available(model))) {
    context.skryba = { used: false, reason: `ollama or model ${model} not available` };
    return;
  }
  const { stat, diff } = stagedDiff(context.repo);
  const recent = new SubprocessRunner().try("git", ["log", "-8", "--format=%s"], { cwd: context.repo }) ?? "";
  const [, type, scope] = context.message.match(/^(\w+)(?:\(([^)]*)\))?:/) ?? [];
  const prompt = [
    `Hint from the file paths: type "${type}", scope "${scope ?? ""}". Keep them unless the diff clearly shows otherwise.`,
    "Write the subject about the purpose of the change: what it makes possible or fixes, not which files changed.",
    "",
    "Recent commit subjects of this repository (for style):",
    recent || "(none)",
    "",
    "Staged changes, stat:",
    stat,
    "",
    "Staged changes, diff (may be trimmed):",
    diff,
  ].join("\n");
  const answer = await ollama.ask("skryba", prompt, {
    format: ANSWER,
    model,
    timeout: context.options.timeout ?? 90000,
  });
  const message = answer && assemble(answer, context.message, `Drafted-by: Skryba (${model} via ollama)`);
  context.skryba = { used: Boolean(message), model, reason: message ? null : "no usable answer" };
  if (message) context.message = message;
};
