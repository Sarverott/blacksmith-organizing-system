// Volumes of a docker host. BOS nests (glossary: nestrelm) are volumes labeled bos.nest.

export const list = async (docker, { nestsOnly = false } = {}) => {
  const { Volumes = [] } = await docker.listVolumes(nestsOnly ? { filters: { label: ["bos.nest"] } } : {});
  return Volumes.map((v) => ({ name: v.Name, driver: v.Driver, mountpoint: v.Mountpoint, labels: v.Labels ?? {} }));
};

export const create = (docker, name, { nest = true, labels = {} } = {}) =>
  docker.createVolume({ Name: name, Labels: { ...(nest ? { "bos.nest": name } : {}), ...labels } });

export const inspect = (docker, name) => docker.getVolume(name).inspect();
export const remove = (docker, name) => docker.getVolume(name).remove();
