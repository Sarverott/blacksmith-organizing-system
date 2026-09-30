import GitClient from "../../bridge/git-client/_index.mjs";

export const readStaged = async (context) => {
  const git = new GitClient();
  context.repo = (await git.root(context.options.cwd ?? process.cwd())) ?? process.cwd();
  context.staged = await git.staged(context.repo);
};
