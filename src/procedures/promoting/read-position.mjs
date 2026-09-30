import GitClient from "../../bridge/git-client/_index.mjs";
import { PROMOTION, REJECTION } from "./branch-flow.mjs";

export const readPosition = async (context) => {
  const git = new GitClient();
  context.repo = (await git.root(context.options.cwd ?? process.cwd())) ?? process.cwd();
  context.from = context.options.from ?? (await git.branch(context.repo));
  const table = context.options.reject ? REJECTION : PROMOTION;
  context.to = table[context.from];
  if (!context.to) {
    throw new Error(
      `"${context.from}" has no ${context.options.reject ? "rejection" : "promotion"} target (flow: ${Object.keys(table).join(", ")})`,
    );
  }
};
