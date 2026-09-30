// Where this BOS installation itself lives on the machine, and which version it is.
// BOS is a project like any other: normally forge/<scope>/<project> inside a workshop.
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = resolve(fileURLToPath(new URL("../..", import.meta.url)));
export const RESOURCES = join(REPO_ROOT, "resources");
export const CLI = join(REPO_ROOT, "src", "cli.mjs");
export const VERSION = JSON.parse(readFileSync(join(REPO_ROOT, "package.json"), "utf8")).version;
