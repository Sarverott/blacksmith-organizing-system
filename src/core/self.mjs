// Where this BOS installation itself lives on the machine.
// BOS is a project like any other: normally forge/<scope>/<project> inside a workshop.
import { fileURLToPath } from "node:url";
import { join, resolve } from "node:path";

export const REPO_ROOT = resolve(fileURLToPath(new URL("../..", import.meta.url)));
export const RESOURCES = join(REPO_ROOT, "resources");
export const CLI = join(REPO_ROOT, "src", "cli.mjs");
