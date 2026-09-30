// Help: the list of commands, or one command's help file with light markdown styling.
import { BOS } from "../../main.ts";
import { MODES } from "../../models/workshop/modes.mjs";
import { header, pad, paint } from "../terminal/paint.mjs";

const markdown = (text) =>
  text
    .replace(/^#+\s*(.+)$/gm, (_, title) => paint.bold(paint.yellow(title)))
    .replace(/`([^`]+)`/g, (_, code) => paint.cyan(code))
    .replace(/\*\*([^*]+)\*\*/g, (_, strong) => paint.bold(strong));

export class HelpView extends BOS.View {
  text({ commands, command, help }) {
    if (command) return markdown(help?.text ?? commands[command]?.info ?? `no help for ${command}`);
    const size = Math.max(...Object.keys(commands).map((name) => name.length)) + 2;
    const line = ([name, c]) => `  ${paint.cyan(pad(name, size))}${c.info ?? ""}${c.repl ? paint.dim("  (repl)") : ""}`;
    const group = (title, entries, always = false) =>
      entries.length || always ? ["", paint.bold(title), ...(entries.length ? entries.map(line) : [paint.dim("  nothing yet")])] : [];
    const all = Object.entries(commands);
    return [
      header("bos <command> [options]"),
      ...group("general", all.filter(([, c]) => !c.mode)),
      ...Object.entries(MODES).flatMap(([name, mode]) =>
        group(`${mode.digit} ${mode.title}`, all.filter(([, c]) => c.mode === name), true)
      ),
      "",
      paint.dim("options: --json  --dry-run  --workshop=PATH   ·   bos help <command>   ·   bos mode"),
    ].join("\n");
  }
}

export default HelpView;
