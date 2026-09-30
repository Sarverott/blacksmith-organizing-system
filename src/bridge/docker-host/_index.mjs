// The docker host (local socket or $DOCKER_HOST) through dockerode.
//   const docker = new DockerHost();  await docker.containers.list()
import Docker from "dockerode";

import { BOS } from "../../main.ts";
import * as container from "./container.mjs";
import * as image from "./image.mjs";
import * as volume from "./volume.mjs";

// bind every helper to this host's client: containers.run(image, …)
const bound = (bridge, helpers) =>
  Object.fromEntries(
    Object.entries(helpers).map(([name, helper]) => [name, (...args) => helper(bridge.client, ...args)]),
  );

export class DockerHost extends BOS.Bridge {
  static id = "docker-host";

  connect() {
    return new Docker(this.options); // no options: $DOCKER_HOST or /var/run/docker.sock
  }

  async available() {
    try {
      await this.client.ping();
      return true;
    } catch {
      return false;
    }
  }

  get containers() {
    return bound(this, container);
  }
  get images() {
    return bound(this, image);
  }
  get volumes() {
    return bound(this, volume);
  }
}

export default DockerHost;
