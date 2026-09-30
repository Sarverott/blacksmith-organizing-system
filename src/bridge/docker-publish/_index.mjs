// Publishing an image: tag it for a registry and push it, over the docker host.
import { BOS } from "../../main.ts";
import DockerHost from "../docker-host/_index.mjs";

export class DockerPublish extends BOS.Bridge {
  static id = "docker-publish";

  get host() {
    this._host ??= new DockerHost(this.options.docker);
    return this._host;
  }

  available() {
    return this.host.available();
  }

  // publish("bos:local", "ghcr.io/sarverott/bos", "0.0.1")
  async publish(localImage, repo, tag = "latest", auth = this.options.auth) {
    await this.host.images.tag(localImage, repo, tag);
    return this.host.images.push(`${repo}:${tag}`, auth);
  }
}

export default DockerPublish;
