import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// add every skill to the plugin in .claude-plugin/marketplace.json (additive only)
export const registerSkills = (context) => {
  context.registered = [];
  // a plugin manifest makes Claude Code scan skills/ itself: nothing to register
  if (existsSync(join(context.root, ".claude-plugin", "plugin.json"))) return;
  const path = join(context.root, ".claude-plugin", "marketplace.json");
  if (!existsSync(path)) return;
  const marketplace = JSON.parse(readFileSync(path, "utf8"));
  const plugin = marketplace.plugins[0];
  const missing = context.skills
    .map((skill) => `./skills/${skill.name}`)
    .filter((entry) => !plugin.skills.includes(entry));
  context.registered = missing;
  if (!missing.length) return;
  plugin.skills.push(...missing);
  if (!context.dryRun) writeFileSync(path, `${JSON.stringify(marketplace, null, 2)}\n`);
  context.changes.push(`${path} (+${missing.length} skills)`);
};
