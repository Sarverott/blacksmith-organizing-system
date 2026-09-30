import { relative } from "node:path";

import { BasicView } from "../core/basic-view.mjs";
import { HOST_ROLES } from "../models/class.mjs";

const mark = (node) => (node.exists ? "ok" : node.mandatory ? "MISSING" : "not yet");

function tree(node, root, depth = 0) {
  const name = depth === 0 ? node.path : relative(root, node.path);
  const line = `${"  ".repeat(depth)}${name.padEnd(36 - depth * 2)} ${node.type.padEnd(12)} ${mark(node)}`;
  return [line, ...node.children.map((child) => tree(child, root, depth + 1))].join("\n");
}

function place(self) {
  if (!self?.place) return "outside the active workshop";
  const { area, scope, project } = self.place;
  return [area, scope, project].filter(Boolean).join(" / ") || "workshop root";
}

export class StatusView extends BasicView {
  data(context) {
    const { workshopRoot, workshopSource, workshops, config, tree, self, changes, dryRun, event } = context;
    return { workshopRoot, workshopSource, workshops, config, tree, self, changes, dryRun, event };
  }

  text(context) {
    const lines = [`workshop  ${context.workshopRoot}  (${context.workshopSource})`];
    if (context.config) {
      const role = context.config.role;
      lines.push(`role      ${role ? `${role}: ${HOST_ROLES[role]}` : "not set (.BOS/workshop.json \"role\")"}`);
    }
    lines.push(`BOS       ${context.self.root}  (${place(context.self)})`);
    const others = context.workshops.filter((path) => path !== context.workshopRoot);
    if (others.length) lines.push(`others    ${others.join("\n          ")}`);
    const snapshot = context.tree ?? context.workshop?.inspect();
    if (snapshot) lines.push("", tree(snapshot, context.workshopRoot));
    if (context.changes?.length) {
      lines.push("", context.dryRun ? "would create:" : "created:", ...context.changes.map((path) => `  ${path}`));
    }
    if (context.event) lines.push("", `recorded  ${context.event.event} @ ${context.event.unixusat}`);
    return lines.join("\n");
  }
}
