// Agent skills of this repository, one per model.
import { BOS } from "../main.ts";
import procedures from "../procedures/_index.mjs";

export class SkillsControll extends BOS.Controll {
  static flows = procedures;

  scaffold(options) {
    return this.run("skilling", options);
  }
}

export default SkillsControll;
