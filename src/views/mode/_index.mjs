// The modes of work as a menu, and the result of a switch.
import { BOS } from "../../main.ts";
import { MODES } from "../../models/workshop/modes.mjs";
import { header, pad, paint } from "../terminal/paint.mjs";

export const modeLabel = (mode) =>
  mode ? `${paint.magenta(MODES[mode].title)} ${paint.dim(MODES[mode].covers)}` : paint.dim("not chosen: bos mode");

export class ModeView extends BOS.View {
  data({ config, previousMode, event }) {
    return { mode: config?.mode ?? null, previousMode: previousMode ?? null, event: event ?? null };
  }

  // the chooser's menu, current mode marked
  menu(current) {
    return [
      header("mode of work"),
      "",
      ...Object.entries(MODES).map(([name, mode]) => {
        const mark = name === current ? paint.green("●") : " ";
        return ` ${mark} ${paint.yellow(mode.digit)}  ${pad(paint.bold(mode.title), 14)} ${paint.dim(mode.covers)}`;
      }),
      `   ${paint.yellow(0)}  ${paint.dim("leave")}`,
      "",
    ].join("\n");
  }

  text({ config, previousMode }) {
    if (previousMode === config.mode) return `mode stays ${modeLabel(config.mode)}`;
    return `mode ${paint.dim(previousMode ?? "none")} ${paint.yellow("→")} ${modeLabel(config.mode)}`;
  }
}

export default ModeView;
