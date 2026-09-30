// One tool format for the whole of BOS. A model carries its tools (static toolkit); the
// execution controll turns each of them into a CLI call (bos <model> <tool>), an MCP tool,
// an OpenAPI operation and a line of a skill. Nothing is described twice.
import { z } from "zod";

// name:       the tool's name within its model (bos <model> <name>)
// info:       one line: what it does
// mode:       the mode of work it serves (almanac, conform, smeltry, commandorate, provision); null: any
// input:      zod shape of the parameters; positional: which of them come as bare operands, in order
// readOnly:   true when it changes nothing (only those are offered to AI agents over MCP)
// run:        async ({ controllers, input, ask }) => result
// render:     (result, views) => text for people; machines get the result as JSON
export function tool({ name, info, mode = null, input = {}, positional = [], readOnly = true, run, render }) {
  if (!name || !run) throw new Error("a tool needs a name and run()");
  return { name, info: info ?? "", mode, input, positional, readOnly, run, render: render ?? null };
}

const unwrap = (schema) => {
  let inner = schema;
  while (inner?.def?.innerType) inner = inner.def.innerType;
  return inner;
};

// CLI operands and --flags → the tool's input, validated by its schema
export function parseInput(entry, operands = [], flags = {}) {
  const raw = {};
  entry.positional.forEach((key, index) => {
    if (operands[index] !== undefined) raw[key] = operands[index];
  });
  for (const [key, value] of Object.entries(flags)) {
    if (!(key in entry.input)) continue;
    const kind = unwrap(entry.input[key])?.def?.type;
    const flag = { true: true, false: false }[String(value)];
    // anything else than true/false stays as given, so the schema reports it
    raw[key] = kind === "boolean" ? (flag ?? value) : kind === "number" ? Number(value) : value;
  }
  const parsed = z.object(entry.input).safeParse(raw);
  if (!parsed.success) {
    const problems = parsed.error.issues.map((issue) => `${issue.path.join(".") || "input"}: ${issue.message}`);
    throw new Error(`bad input for ${entry.model} ${entry.name}: ${problems.join("; ")}`);
  }
  return parsed.data;
}

// "--dry-run --workshop=/x" → { dryRun: true, workshop: "/x" }, and the bare operands
export function parseArgs(args) {
  const flags = {};
  const operands = [];
  for (const arg of args) {
    if (!arg.startsWith("--")) {
      operands.push(arg);
      continue;
    }
    const [key, value = true] = arg.slice(2).split(/=(.*)/s);
    flags[key.replace(/-(\w)/g, (_, c) => c.toUpperCase())] = value;
  }
  return { operands, flags };
}
