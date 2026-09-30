// Help: the list of commands, or one command's help file with light markdown styling.
import { BOS } from "../../main.ts";
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
    return [
      header("bos <command> [options]"),
      "",
      ...Object.entries(commands).map(([name, c]) => `  ${paint.cyan(pad(name, size))}${c.info ?? ""}${c.repl ? paint.dim("  (repl)") : ""}`),
      "",
      paint.dim("options: --json  --dry-run  --workshop=PATH   ·   bos help <command>"),
    ].join("\n");
  }
}

export default HelpView;
