// One station along the branch flow: from → to, and the plan.
import { BOS } from "../../main.ts";
import { BRANCHES } from "../../procedures/promoting/branch-flow.mjs";
import { paint } from "../terminal/paint.mjs";

export class PromotionView extends BOS.View {
  data({ from, to, plan, dryRun, pullRequest }) {
    return { from, to, plan, dryRun, pullRequest };
  }

  text({ from, to, plan, dryRun }) {
    return [
      `${paint.cyan(from)} ${paint.yellow("→")} ${paint.cyan(to)}  ${paint.dim(BRANCHES[to])}`,
      ...plan.map((step) => `  ${paint.dim("•")} ${step}`),
      dryRun ? paint.dim("dry run: add --apply to execute") : paint.green("applied"),
    ].join("\n");
  }
}

export default PromotionView;
