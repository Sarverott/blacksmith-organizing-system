import {BOS} from "../main"

import dockerHost from "./docker-host/_index.mjs"
import dockerPublish from "./docker-publish/_index.mjs"
import gitClient from "./git-client/_index.mjs"
import giteaApi from "./gitea-api/_index.mjs"
import githubApi from "./github-api/_index.mjs"
import npmPublish from "./npm-publish/_index.mjs"
import sshLink from "./ssh-link/_index.mjs"
import BOSLINK from "./bos-instances-link/_index.mjs"
import subprocessRunner from "./subprocess-runner/_index.mjs"

class testBridge extends BOS.Bridge{}

export default {
    subprocessRunner,
    testBridge,
    dockerHost,
    dockerPublish,
    gitClient,
    giteaApi,
    githubApi,
    npmPublish,
    sshLink,
    BOSLINK
}