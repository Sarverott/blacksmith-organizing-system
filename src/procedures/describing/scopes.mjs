// Which part of the project a path belongs to: the scope of a conventional commit.
const BUILD = new Set([
  "package.json", "package-lock.json", "Taskfile.yml", "vitest.config.mjs", "commitlint.config.mjs",
  "release.config.mjs", "Dockerfile", "compose.yaml", ".dockerignore", "mkdocs.yml", ".readthedocs.yaml", ".gitignore",
]);

export function scopeOf(path) {
  const [top, part] = path.split("/");
  if (top === "src") return ["main.ts", "cli.mjs", "index.mjs"].includes(part) ? "core" : part;
  if (top === "tests") return "tests";
  if (top === "docs") return "docs";
  if (top === ".github") return "ci";
  if (top === "resources") return "resources";
  if (["skills", "template", ".claude-plugin"].includes(top)) return "skills";
  if (top === ".husky" || BUILD.has(path)) return "build";
  return "repo";
}

// the thing a path is about: src/procedures/closing/x.mjs → closing; docs/glossary/mode.md → mode
export function targetOf(path) {
  const parts = path.split("/");
  const base = parts.at(-1).replace(/\.[^.]+$/, "");
  if (parts[0] === "src" && parts.length > 3) return parts[2];
  return ["_index", "index", "class", "README", "exec", "help"].includes(base) && parts.length > 1 ? parts.at(-2) : base;
}
