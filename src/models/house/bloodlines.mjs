// Bloodline: follow a model's parent_model back to its root; the root names the releaser.
import { existsSync, readFileSync } from "node:fs";

import { sameModel } from "./groups.mjs";

export function readReleasers(path) {
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")).releasers : [];
}

// catalog: [{ name, family, parent }] as ollama lists it; a parent that is a file path ends the chain
export function rootOf(catalog, model) {
  const seen = new Set();
  let current = catalog.find((entry) => sameModel(entry.name, model));
  while (current?.parent && !current.parent.startsWith("/") && !seen.has(current.name)) {
    seen.add(current.name);
    const parent = catalog.find((entry) => sameModel(entry.name, current.parent));
    if (!parent) return { name: current.parent, family: current.family };
    current = parent;
  }
  return current ? { name: current.name, family: current.family } : { name: model, family: null };
}

export function bloodlineOf(catalog, releasers, model) {
  const root = rootOf(catalog, model);
  const rule = releasers.find(({ match }) => root.name.toLowerCase().replace(/^.*\//, "").startsWith(match));
  return { root: root.name, releaser: rule?.releaser ?? (root.family ? `${root.family} (architecture)` : "unknown") };
}
