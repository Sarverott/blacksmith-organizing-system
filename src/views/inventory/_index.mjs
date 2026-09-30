// What sinking would have to rescue: projects with their state, and ttystories.
import { BOS } from "../../main.ts";
import { header, pad, paint } from "../terminal/paint.mjs";

export class InventoryView extends BOS.View {
  data({ inventory }) {
    return inventory;
  }

  text({ inventory }) {
    const rows = inventory.projects.map(
      ({ scope, project, branch, uncommitted }) =>
        `  ${pad(`${scope}/${project}`, 48)} ${paint.cyan(pad(branch ?? "?", 14))} ${uncommitted ? paint.red(`${uncommitted} uncommitted`) : paint.green("clean")}`,
    );
    return [
      header("sinking inventory"),
      "",
      paint.bold(`projects (${rows.length})`),
      ...(rows.length ? rows : [paint.dim("  none in forge")]),
      "",
      paint.bold(`ttystories (${inventory.ttystories.length})`),
      ...inventory.ttystories.map((name) => `  ${name}`),
    ].join("\n");
  }
}

export default InventoryView;
