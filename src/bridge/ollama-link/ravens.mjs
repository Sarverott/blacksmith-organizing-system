// Ravens: AI helpers of the workshop, one markdown file each in resources/ravens/.
// Frontmatter (model, duty) + the text below it as the raven's system prompt.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { RESOURCES } from "../../core/self.mjs";

const DIR = join(RESOURCES, "ravens");

export function readRaven(name) {
  const path = join(DIR, `${name}.md`);
  if (!existsSync(path)) throw new Error(`no raven "${name}" in resources/ravens/`);
  const [, head = "", system = ""] = readFileSync(path, "utf8").match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? [];
  const meta = Object.fromEntries(
    head
      .split("\n")
      .map((line) => line.match(/^(\w+):\s*(.*)$/))
      .filter(Boolean)
      .map(([, k, v]) => [k, v.trim()]),
  );
  return { name, ...meta, system: system.trim() };
}

// models that must not be called: resources/ravens/resting.json (the author's decision)
export function resting() {
  const path = join(DIR, "resting.json");
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : { reason: "", patterns: [] };
}

export const isResting = (model) =>
  resting().patterns.some((pattern) => model?.toLowerCase().includes(pattern.toLowerCase()));

export const listRavens = () =>
  existsSync(DIR)
    ? readdirSync(DIR)
        .filter((file) => file.endsWith(".md"))
        .map((file) => readRaven(file.slice(0, -3)))
    : [];
