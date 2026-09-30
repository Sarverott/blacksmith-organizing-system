// A bridge shapes one outside system (docker host, github, git, a subprocess…)
// into a few plain methods. The SDK client is created lazily, on first use.

export class BasicBridge {
  static id = "bridge";

  constructor(options = {}) {
    this.options = options;
  }

  get client() {
    this._client ??= this.connect();
    return this._client;
  }

  // create the SDK client (dockerode, octokit, …); null when the bridge needs none
  connect() {
    return null;
  }

  // can this bridge be used on this machine right now?
  async available() {
    return true;
  }

  toString() {
    return `[<BOS.Bridge::${this.constructor.id}>]`;
  }
}
