// GitHub through octokit. Token: options.token, $GITHUB_TOKEN or $GH_TOKEN.
import { Octokit } from "octokit";

import { BOS } from "../../main.ts";

export class GithubApi extends BOS.Bridge {
  static id = "github-api";

  connect() {
    return new Octokit({ auth: this.options.token ?? process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN });
  }

  async available() {
    try {
      await this.me();
      return true;
    } catch {
      return false;
    }
  }

  async me() {
    return (await this.client.rest.users.getAuthenticated()).data.login;
  }

  async repos() {
    const repos = await this.client.paginate(this.client.rest.repos.listForAuthenticatedUser, { per_page: 100 });
    return repos.map((r) => ({ name: r.full_name, private: r.private, url: r.clone_url, branch: r.default_branch }));
  }

  async repo(owner, repo) {
    return (await this.client.rest.repos.get({ owner, repo })).data;
  }

  async createRepo(name, { private: isPrivate = false, description = "" } = {}) {
    return (await this.client.rest.repos.createForAuthenticatedUser({ name, private: isPrivate, description })).data;
  }

  // releasing → master lands in canon through a pull request
  async pullRequest({ owner, repo, head, base = "master", title = `${head} → ${base}`, body = "" }) {
    return (await this.client.rest.pulls.create({ owner, repo, head, base, title, body })).data;
  }
}

export default GithubApi;
