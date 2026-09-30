// Every bridge, by name. Each one shapes an outside system into plain methods.
import BosInstancesLink from "./bos-instances-link/_index.mjs";
import DockerHost from "./docker-host/_index.mjs";
import DockerPublish from "./docker-publish/_index.mjs";
import GitClient from "./git-client/_index.mjs";
import GiteaApi from "./gitea-api/_index.mjs";
import GithubApi from "./github-api/_index.mjs";
import NpmPublish from "./npm-publish/_index.mjs";
import SshLink from "./ssh-link/_index.mjs";
import SubprocessRunner from "./subprocess-runner/_index.mjs";

export default {
  subprocessRunner: SubprocessRunner,
  dockerHost: DockerHost,
  dockerPublish: DockerPublish,
  gitClient: GitClient,
  giteaApi: GiteaApi,
  githubApi: GithubApi,
  npmPublish: NpmPublish,
  sshLink: SshLink,
  BOSLINK: BosInstancesLink,
};
