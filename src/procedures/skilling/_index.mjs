import { BOS } from "../../main.ts";
import { collectModels } from "./collect-models.mjs";
import { composeSkills } from "./compose-skill.mjs";
import { registerSkills } from "./register-skills.mjs";
import { writeSkills } from "./write-skills.mjs";

export const skilling = new BOS.Procedure("skilling", [], {
  description: "draft an agent skill for every model that has none",
})
  .step("collect models", collectModels)
  .step("compose skills", composeSkills)
  .step("write missing skills", writeSkills)
  .step("register in marketplace", registerSkills);

export default skilling;
