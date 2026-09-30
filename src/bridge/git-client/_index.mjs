// Local repositories through isomorphic-git (no git binary needed); remotes over
// http(s), e.g. the internal Gitea. Every method takes the repository dir first.
import fs from "node:fs";

import git from "isomorphic-git";
import http from "isomorphic-git/http/node";

import { BOS } from "../../main.ts";
import { resolveAuthor } from "./author.mjs";

export class GitClient extends BOS.Bridge {
  static id = "git-client";

  // credentials for remotes: options.token / $GITEA_TOKEN (username optional)
  get auth() {
    const password = this.options.token ?? process.env.GITEA_TOKEN;
    return password ? () => ({ username: this.options.username ?? "bos", password }) : undefined;
  }

  root(path) { return git.findRoot({ fs, filepath: path }).catch(() => null); }
  init(dir) { return git.init({ fs, dir, defaultBranch: "master" }); }
  branch(dir) { return git.currentBranch({ fs, dir }); }
  branches(dir) { return git.listBranches({ fs, dir }); }
  hasBranch(dir, ref) { return this.branches(dir).then((all) => all.includes(ref)); }
  createBranch(dir, ref, from) { return git.branch({ fs, dir, ref, object: from }); }
  checkout(dir, ref) { return git.checkout({ fs, dir, ref }); }

  async log(dir, depth = 10) {
    return (await git.log({ fs, dir, depth })).map(({ oid, commit }) => ({
      oid, message: commit.message.trim(), author: commit.author.name, at: commit.author.timestamp * 1000,
    }));
  }

  // changed files only: [path, "modified" | "added" | "deleted" | "untracked"]
  async changes(dir) {
    const names = { "0,2,0": "untracked", "0,2,2": "added", "1,2,1": "modified", "1,2,2": "modified", "1,0,1": "deleted", "1,0,0": "deleted", "1,1,0": "deleted" };
    return (await git.statusMatrix({ fs, dir }))
      .filter(([, head, work, stage]) => !(head === 1 && work === 1 && stage === 1))
      .map(([path, ...state]) => [path, names[state.join(",")] ?? state.join(",")]);
  }

  async commit(dir, message, paths = ["."]) {
    for (const filepath of paths) await git.add({ fs, dir, filepath });
    return git.commit({ fs, dir, message, author: await resolveAuthor(git, fs, dir) });
  }

  // merge `from` into `to` as a merge commit, then leave `to` checked out
  async merge(dir, from, to, message = `${from} → ${to}`) {
    await this.checkout(dir, to);
    const result = await git.merge({ fs, dir, ours: to, theirs: from, fastForward: false, message, author: await resolveAuthor(git, fs, dir) });
    await this.checkout(dir, to);
    return result;
  }

  addRemote(dir, remote, url) { return git.addRemote({ fs, dir, remote, url }); }
  clone(url, dir, { ref, depth } = {}) { return git.clone({ fs, http, dir, url, ref, depth, singleBranch: Boolean(ref), onAuth: this.auth }); }
  fetch(dir, remote = "origin") { return git.fetch({ fs, http, dir, remote, onAuth: this.auth }); }
  push(dir, ref, remote = "origin") { return git.push({ fs, http, dir, remote, ref, onAuth: this.auth }); }
}

export default GitClient;
