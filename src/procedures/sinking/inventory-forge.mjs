import GitClient from "../../bridge/git-client/_index.mjs";

// every project in the forge, its branch, and work not yet committed
export const inventoryForge = async (context) => {
  const git = new GitClient();
  context.inventory ??= {};
  context.inventory.projects = [];
  for (const scope of context.workshop.forge.scopes()) {
    for (const project of scope.projects()) {
      context.inventory.projects.push({
        scope: scope.name,
        project: project.name,
        branch: await git.branch(project.path).catch(() => null),
        uncommitted: (await git.changes(project.path).catch(() => [])).length,
      });
    }
  }
};
