// The self-hosted Gitea that carries private scope repositories and pre-public drafts.
// Address: options.url or $GITEA_URL (e.g. http://gitea.lan:3000); token: options.token or $GITEA_TOKEN.
import { BOS } from "../../main.ts";

export class GiteaApi extends BOS.Bridge {
  static id = "gitea-api";

  get url() {
    const url = this.options.url ?? process.env.GITEA_URL;
    if (!url) throw new Error("Gitea address unknown: set $GITEA_URL");
    return url.replace(/\/+$/, "");
  }

  get token() {
    return this.options.token ?? process.env.GITEA_TOKEN;
  }

  async request(method, path, body) {
    const response = await fetch(`${this.url}/api/v1${path}`, {
      method,
      headers: {
        "content-type": "application/json",
        ...(this.token ? { authorization: `token ${this.token}` } : {}),
      },
      body: body && JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`gitea ${method} ${path}: ${response.status} ${response.statusText}`);
    return response.status === 204 ? null : response.json();
  }

  async available() {
    try {
      await this.request("GET", "/version");
      return true;
    } catch {
      return false;
    }
  }

  async me() { return (await this.request("GET", "/user")).login; }

  async repos() {
    return (await this.request("GET", "/user/repos")).map((r) => ({ name: r.full_name, private: r.private, url: r.clone_url }));
  }

  // scopes are private by default
  createRepo(name, { private: isPrivate = true, description = "" } = {}) {
    return this.request("POST", "/user/repos", { name, private: isPrivate, description, default_branch: "master" });
  }

  cloneUrl(owner, repo) {
    return `${this.url}/${owner}/${repo}.git`;
  }
}

export default GiteaApi;
