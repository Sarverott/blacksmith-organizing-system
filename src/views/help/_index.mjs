// Help from the registry: every tool grouped by mode of work, or one model's tools, or one tool.
import { BOS } from "../../main.ts";
import { MODES } from "../../models/workshop/modes.mjs";
import { header, pad, paint } from "../terminal/paint.mjs";

const unwrap = (schema) => {
  let inner = schema;
  while (inner?.def?.innerType) inner = inner.def.innerType;
  return inner;
};

function detail(entry) {
  const params = Object.entries(entry.input).map(([key, schema]) => {
    const positional = entry.positional.includes(key);
    const optional = schema.safeParse(undefined).success;
    const kind = unwrap(schema)?.def?.type ?? "value";
    const usage = positional
      ? `<${key}>`
      : kind === "boolean"
        ? `--${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`
        : `--${key}=…`;
    return `  ${paint.cyan(pad(optional ? `[${usage}]` : usage, 26))}${schema.description ?? ""}`;
  });
  return [
    header(`bos ${entry.model} ${entry.name}`),
    "",
    entry.info,
    "",
    `${paint.dim("mode")}  ${entry.mode ? MODES[entry.mode].title : "any"}   ${paint.dim("changes the workshop")}  ${entry.readOnly ? "no" : "yes"}`,
    ...(params.length ? ["", paint.bold("parameters"), ...params] : []),
  ].join("\n");
}

export class HelpView extends BOS.View {
  text({ tools, ask = [] }) {
    const [model, name] = ask;
    if (model && name) {
      const entry = tools.find((t) => t.model === model && t.name === name);
      return entry ? detail(entry) : `no tool "${model} ${name}"`;
    }
    const shown = model ? tools.filter((t) => t.model === model) : tools;
    if (model && !shown.length) return `no model "${model}" with tools`;
    const size = Math.max(...shown.map((t) => `${t.model} ${t.name}`.length)) + 2;
    const line = (t) => `  ${paint.cyan(pad(`${t.model} ${t.name}`, size))}${t.info}`;
    const group = (title, entries) => [
      "",
      paint.bold(title),
      ...(entries.length ? entries.map(line) : [paint.dim("  nothing yet")]),
    ];
    return [
      header("bos <model> <tool> [options]"),
      ...group(
        "general",
        shown.filter((t) => !t.mode),
      ),
      ...Object.entries(MODES).flatMap(([key, mode]) =>
        group(
          `${mode.digit} ${mode.title}`,
          shown.filter((t) => t.mode === key),
        ),
      ),
      "",
      paint.dim("options: --json  --workshop=PATH   ·   bos help <model> [tool]   ·   bos repl   ·   bos --version"),
    ].join("\n");
  }
}

export default HelpView;
