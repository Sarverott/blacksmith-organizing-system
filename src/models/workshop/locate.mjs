// Finding workshops on the machine: per user (~/__WORKSHOP) and per partition (/media/**/__WORKSHOP).
import { existsSync, readdirSync } from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";

export const WORKSHOP_DIRNAME = "__WORKSHOP";

export function findAncestorWorkshop(start) {
  let dir = resolve(start);
  while (dir !== dirname(dir)) {
    if (basename(dir) === WORKSHOP_DIRNAME) return dir;
    dir = dirname(dir);
  }
  return null;
}

// the active workshop: first rule that answers wins
export function resolveWorkshop({ explicit, variable, cwd, self, home }) {
  const rules = [
    ["--workshop option", () => explicit && resolve(explicit)],
    ["$BOS_WORKSHOP", () => variable && resolve(variable.replace(/^~(?=$|\/)/, home))],
    ["ancestor of current directory", () => findAncestorWorkshop(cwd)],
    ["ancestor of BOS installation", () => findAncestorWorkshop(self)],
    ["default per user", () => join(home, WORKSHOP_DIRNAME)],
  ];
  for (const [source, rule] of rules) {
    const root = rule();
    if (root) return { root, source };
  }
}

export function listWorkshops(home, mediaRoot = "/media", maxDepth = 4) {
  const found = new Set();
  if (existsSync(join(home, WORKSHOP_DIRNAME))) found.add(join(home, WORKSHOP_DIRNAME));
  (function scan(dir, depth) {
    if (depth > maxDepth) return;
    let entries = [];
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries.filter((entry) => entry.isDirectory())) {
      const path = join(dir, entry.name);
      if (entry.name === WORKSHOP_DIRNAME) found.add(path);
      else scan(path, depth + 1);
    }
  })(mediaRoot, 1);
  return [...found];
}

// where a path sits inside a workshop: area, and for forge its scope and project
export function placeOf(target, workshopRoot) {
  const rel = relative(workshopRoot, resolve(target));
  if (rel === "") return { area: null };
  if (rel.startsWith("..")) return null;
  const [area, ...rest] = rel.split(sep);
  if (area === "forge") return { area, scope: rest[0] ?? null, project: rest[1] ?? null, inner: rest.slice(2).join("/") || null };
  return { area, inner: rest.join("/") || null };
}
