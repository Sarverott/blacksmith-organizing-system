// Who signs commits: repository config, then ~/.gitconfig, then the system user.
// (isomorphic-git reads only the repository's own config.)
import { readFileSync } from "node:fs";
import { homedir, userInfo } from "node:os";
import { join } from "node:path";

function globalConfig() {
  try {
    const text = readFileSync(join(homedir(), ".gitconfig"), "utf8");
    const user = text.split(/^\[/m).find((section) => section.startsWith("user]")) ?? "";
    const value = (key) => user.match(new RegExp(`^\\s*${key}\\s*=\\s*(.+)$`, "m"))?.[1].trim();
    return { name: value("name"), email: value("email") };
  } catch {
    return {};
  }
}

export async function resolveAuthor(git, fs, dir) {
  const local = {
    name: await git.getConfig({ fs, dir, path: "user.name" }),
    email: await git.getConfig({ fs, dir, path: "user.email" }),
  };
  const global = globalConfig();
  const name = local.name ?? global.name ?? userInfo().username;
  return { name, email: local.email ?? global.email ?? `${name}@localhost` };
}
