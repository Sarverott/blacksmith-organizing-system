// Containers of a docker host (dockerode client in, plain data out).

export const list = async (docker, { all = true } = {}) =>
  (await docker.listContainers({ all })).map((c) => ({
    id: c.Id.slice(0, 12),
    name: c.Names[0]?.replace(/^\//, ""),
    image: c.Image,
    state: c.State,
    status: c.Status,
  }));

export async function run(docker, image, { name, cmd, env = {}, binds = [], labels = {} } = {}) {
  const container = await docker.createContainer({
    Image: image,
    name,
    Cmd: cmd,
    Env: Object.entries(env).map(([key, value]) => `${key}=${value}`),
    Labels: { "bos.managed": "true", ...labels },
    HostConfig: { Binds: binds },
  });
  await container.start();
  return container.id;
}

export const start = (docker, id) => docker.getContainer(id).start();
export const stop = (docker, id) => docker.getContainer(id).stop();
export const remove = (docker, id, { force = false } = {}) => docker.getContainer(id).remove({ force });

export async function logs(docker, id, { tail = 100 } = {}) {
  const buffer = await docker.getContainer(id).logs({ stdout: true, stderr: true, tail });
  return buffer.toString("utf8");
}
