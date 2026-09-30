// Read the machine: who, where, when; which workshop is active; where BOS itself sits.
import { existsSync, readdirSync } from "node:fs";
import { homedir, hostname, userInfo } from "node:os";
import { basename, dirname, join, relative, resolve, sep } from "node:path";

import { BasicProcedure } from "../basic-procedure.mjs";
import { CLI, REPO_ROOT } from "../self.mjs";
import { WORKSHOP_DIRNAME } from "../../models/class.mjs";

export function findAncestorWorkshop(start) {
  let dir = resolve(start);
  while (dir !== dirname(dir)) {
    if (basename(dir) === WORKSHOP_DIRNAME) return dir;
    dir = dirname(dir);
  }
  return null;
}

// active workshop, first rule that answers wins
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

// every workshop on the machine: per user and per partition (/media/**/__WORKSHOP)
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

export const envRead = new BasicProcedure("env-read", [], {
  description: "read host, user and time; locate the active workshop and BOS itself",
})
  .step("read environment", (context) => {
    context.env = {
      host: hostname(),
      user: userInfo().username,
      home: homedir(),
      cwd: process.cwd(),
      platform: process.platform,
      unixusat: Date.now(), // unix timestamp in milliseconds
    };
  })
  .step("locate workshop", (context) => {
    const { root, source } = resolveWorkshop({
      explicit: context.options?.workshop,
      variable: process.env.BOS_WORKSHOP,
      cwd: context.env.cwd,
      self: REPO_ROOT,
      home: context.env.home,
    });
    context.workshopRoot = root;
    context.workshopSource = source;
    context.workshops = listWorkshops(context.env.home);
    if (!context.workshops.includes(root)) context.workshops.unshift(root);
  })
  .step("locate self", (context) => {
    context.self = { root: REPO_ROOT, cli: CLI, place: placeOf(REPO_ROOT, context.workshopRoot) };
  });
