// Images of a docker host.

export const list = async (docker) =>
  (await docker.listImages()).map((i) => ({
    id: i.Id.replace(/^sha256:/, "").slice(0, 12),
    tags: i.RepoTags ?? [],
    size: i.Size,
  }));

// resolve when every layer is pulled / pushed
const follow = (docker, stream) =>
  new Promise((resolve, reject) => docker.modem.followProgress(stream, (error, output) => (error ? reject(error) : resolve(output))));

export const pull = async (docker, name) => follow(docker, await docker.pull(name));

export const tag = (docker, name, repo, tagName = "latest") => docker.getImage(name).tag({ repo, tag: tagName });

export const push = async (docker, name, auth) => follow(docker, await docker.getImage(name).push({ authconfig: auth }));

export const remove = (docker, name, { force = false } = {}) => docker.getImage(name).remove({ force });
