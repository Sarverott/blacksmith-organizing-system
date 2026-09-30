// The state of a workshop: where it is, its role, where BOS sits, its tree, what changed.
import { BOS } from "../../main.ts";
import { HOST_ROLES } from "../../models/workshop/host-roles.mjs";
import { modeLabel } from "../mode/_index.mjs";
import { field, header, paint } from "../terminal/paint.mjs";
import { drawTree } from "./tree.mjs";

function place(self) {
  if (!self?.place) return paint.dim("outside the active workshop");
  const { area, scope, project } = self.place;
  return [area, scope, project].filter(Boolean).join(paint.dim(" / ")) || "workshop root";
}

export class StatusView extends BOS.View {
  data(context) {
    const { workshopRoot, workshopSource, workshops, config, defaulted, tree, self, changes, dryRun, event } = context;
    return { workshopRoot, workshopSource, workshops, config, defaulted, tree, self, changes, dryRun, event };
  }

  text(context) {
    const lines = [header("Blacksmith Organization System"), ""];
    lines.push(field("workshop", `${context.workshopRoot} ${paint.dim(`(${context.workshopSource})`)}`));
    if (context.config) {
      const { role } = context.config;
      const byDefault = (key) => (context.defaulted?.includes(key) ? paint.dim("  (default)") : "");
      lines.push(field("role", (role ? `${paint.cyan(role)} ${paint.dim(HOST_ROLES[role])}` : paint.dim('not set: .BOS/workshop.json "role"')) + byDefault("role")));
      lines.push(field("mode", modeLabel(context.config.mode) + byDefault("mode")));
    }
    lines.push(field("BOS", `${paint.bold(`v${context.self.version}`)} ${paint.dim("·")} ${place(context.self)}`));
    const others = context.workshops.filter((path) => path !== context.workshopRoot);
    if (others.length) lines.push(field("others", others.join("\n          ")));
    const snapshot = context.tree ?? context.workshop?.inspect();
    if (snapshot) lines.push("", drawTree(snapshot));
    if (context.changes?.length) {
      lines.push("", paint.bold(context.dryRun ? "would create" : "created"), ...context.changes.map((path) => `  ${paint.green("+")} ${path}`));
    }
    if (context.event) lines.push("", field("recorded", `${paint.magenta(context.event.event)} ${paint.dim(`@ ${context.event.unixusat}`)}`));
    return lines.join("\n");
  }
}

export default StatusView;
