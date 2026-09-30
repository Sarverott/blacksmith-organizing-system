import { REPO_ROOT } from "../../core/self.mjs";
import { listWorkshops, resolveWorkshop } from "../../models/workshop/locate.mjs";

export const locateWorkshop = (context) => {
  const { root, source } = resolveWorkshop({
    explicit: context.options?.workshop,
    variable: process.env.BOS_WORKSHOP,
    cwd: context.env.cwd,
    self: REPO_ROOT,
    home: context.env.home,
  });
  context.workshopRoot = root;
  context.workshopSource = source;
  context.workshops = listWorkshops(context.env.home);
  if (!context.workshops.includes(root)) context.workshops.unshift(root);
};
