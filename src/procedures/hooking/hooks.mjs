// what each git hook adds to its storyline entry
import GitClient from "../../bridge/git-client/_index.mjs";

const git = new GitClient();

export const HOOKS = {
  "post-commit": async (repo) => ({ commit: (await git.log(repo, 1))[0] ?? null }),
  "post-checkout": async (repo) => ({ branch: await git.branch(repo) }),
  "post-merge": async (repo) => ({ head: (await git.log(repo, 1))[0]?.oid ?? null }),
};
