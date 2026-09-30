import { BOS } from "../../main.ts";
import { apply } from "./apply.mjs";
import { plan } from "./plan.mjs";
import { readPosition } from "./read-position.mjs";

export const promoting = new BOS.Procedure("promoting", [], {
  description: "move work one station along the branch flow",
})
  .step("read position", readPosition)
  .step("plan", plan)
  .step("apply", apply);

export * from "./branch-flow.mjs";
export default promoting;
