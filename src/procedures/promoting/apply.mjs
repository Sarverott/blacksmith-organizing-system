import fs from "node:fs";

import git from "isomorphic-git";

import GitClient from "../../bridge/git-client/_index.mjs";
import GithubApi from "../../bridge/github-api/_index.mjs";

// owner/repo from a github remote url (https or ssh)
async function githubRepo(dir) {
  const url = (await git.getConfig({ fs, dir, path: "remote.origin.url" })) ?? "";
  const match = url.match(/github\.com[:/]([^/]+)\/(.+?)(\.git)?$/);
  if (!match) throw new Error(`origin is not a GitHub repository: ${url || "no origin"}`);
  return { owner: match[1], repo: match[2] };
}

export const apply = async (context) => {
  if (context.dryRun) return;
  const { from, to, repo } = context;
  if (context.pullRequest) {
    context.result = await new GithubApi().pullRequest({ ...(await githubRepo(repo)), head: from, base: to });
    return;
  }
  const client = new GitClient();
  const changes = await client.changes(repo);
  if (changes.length) throw new Error(`${changes.length} uncommitted changes in ${repo}: commit them before promoting`);
  if (!(await client.hasBranch(repo, to))) await client.createBranch(repo, to, from);
  context.result = await client.merge(repo, from, to);
};
