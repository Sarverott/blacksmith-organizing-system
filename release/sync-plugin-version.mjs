// semantic-release plugin (local): the Claude Code plugin's version follows BOS's release,
// so installed plugins move to a new version exactly when BOS releases one on master.
import { readFileSync, writeFileSync } from "node:fs";

const MANIFEST = ".claude-plugin/plugin.json";

export function prepare(_pluginConfig, { nextRelease, logger }) {
  const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
  manifest.version = nextRelease.version;
  writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  logger.log(`${MANIFEST} → ${nextRelease.version}`);
}
