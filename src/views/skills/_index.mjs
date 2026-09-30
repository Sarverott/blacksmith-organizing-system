// Which model has a skill, which got a fresh draft.
import { BOS } from "../../main.ts";
import { header, pad, paint } from "../terminal/paint.mjs";

export class SkillsView extends BOS.View {
  data({ skills, registered, dryRun }) {
    return { skills: skills.map(({ name, created }) => ({ name, created })), registered, dryRun };
  }

  text({ skills, registered = [], dryRun }) {
    const state = (created) => (created ? paint.green(dryRun ? "+ would draft" : "+ drafted") : paint.dim("● exists"));
    return [
      header("skills"),
      "",
      ...skills.map(({ name, created }) => `  ${pad(paint.cyan(name), 24)} ${state(created)}`),
      "",
      registered.length ? `${dryRun ? "would register" : "registered"} ${registered.length} in marketplace.json` : paint.dim("marketplace up to date"),
    ].join("\n");
  }
}

export default SkillsView;
