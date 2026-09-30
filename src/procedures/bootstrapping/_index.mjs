import { BOS } from "../../main.ts";
import loading from "../loading/_index.mjs";
import { deployGuides } from "./deploy-guides.mjs";
import { ensureTree } from "./ensure-tree.mjs";

export const bootstrapSteps = new BOS.Procedure("bootstrapping", [], { description: "create missing areas and descriptors, deploy agent guides" })
  .step("ensure workshop tree", ensureTree)
  .step("deploy agent guides", deployGuides);

export const bootstrapping = loading.chain(bootstrapSteps, "bootstrapping");
export default bootstrapping;
