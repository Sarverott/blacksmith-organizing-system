import GitClient from "../../bridge/git-client/_index.mjs";
import { HOOKS } from "./hooks.mjs";

export const recordHook = async (context) => {
  const hook = context.options.hook;
  if (!(hook in HOOKS)) throw new Error(`unhandled hook "${hook}" (known: ${Object.keys(HOOKS).join(", ")})`);
  const repo = (await new GitClient().root(context.env.cwd)) ?? context.env.cwd;
  const storylines = context.workshop.storylines.ensure(context);
  context.event = storylines.record(
    { event: "git-hook", hook, repo, place: context.workshop.placeOf(repo), ...(await HOOKS[hook](repo)) },
    context
  );
};
