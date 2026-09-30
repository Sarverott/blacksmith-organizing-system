import GitClient from "../../bridge/git-client/_index.mjs";
import { needsPullRequest } from "./branch-flow.mjs";

export const plan = async (context) => {
  const { from, to, repo } = context;
  context.pullRequest = needsPullRequest(from, to);
  context.plan = context.pullRequest
    ? [`pull request ${from} → ${to} on GitHub`]
    : [
        ...((await new GitClient().hasBranch(repo, to)) ? [] : [`create branch ${to} from ${from}`]),
        `merge ${from} into ${to} (merge commit "${from} → ${to}")`,
        `leave ${to} checked out`,
      ];
};
