// Branch movement procedures (docs/infographics/branch-movement-procedures.md):
// master → developement → revision → testing → releasing → master,
// and a rejection from revision, testing or releasing goes back to developement.
import { BasicProcedure } from "../basic-procedure.mjs";
import { git } from "../basic-bridge.mjs";

export const CANON = "master";

export const BRANCHES = {
  master: "spine of canon: stable state shared with production",
  developement: "further changing: here we code",
  revision: "control of code: approval by a maintainer",
  testing: "quality assurance: tests, nightly builds",
  releasing: "stamping, publishing and announcing",
};

export const PROMOTION = {
  master: "developement",
  developement: "revision",
  revision: "testing",
  testing: "releasing",
  releasing: "master",
};

export const REJECTION = {
  revision: "developement",
  testing: "developement",
  releasing: "developement",
};

// releasing lands in canon only through a pull request
export const REQUIRES_PULL_REQUEST = new Set([`releasing>${CANON}`]);

export const promote = new BasicProcedure("promote", [], {
  description: "move work one station along the branch flow (dry run unless applied)",
})
  .step("read position", (context) => {
    const cwd = context.options.cwd ?? process.cwd();
    context.cwd = cwd;
    context.from = context.options.from ?? git.run(["branch", "--show-current"], { cwd });
    const table = context.options.reject ? REJECTION : PROMOTION;
    context.to = table[context.from];
    if (!context.to) {
      throw new Error(`"${context.from}" has no ${context.options.reject ? "rejection" : "promotion"} target (flow: ${Object.keys(table).join(", ")})`);
    }
  })
  .step("plan", (context) => {
    const { from, to, cwd } = context;
    context.pullRequest = REQUIRES_PULL_REQUEST.has(`${from}>${to}`);
    context.plan = context.pullRequest
      ? [["gh", "pr", "create", "--base", to, "--head", from, "--fill"]]
      : [
          ...(git.try(["rev-parse", "--verify", "--quiet", to], { cwd }) ? [] : [["git", "branch", to, from]]),
          ["git", "switch", to],
          ["git", "merge", "--no-ff", from, "-m", `${from} → ${to}`],
        ];
  })
  .step("apply", (context) => {
    if (context.dryRun) return;
    if (context.pullRequest) throw new Error(`${context.from} → ${context.to} needs a pull request: ${context.plan[0].join(" ")}`);
    for (const [, ...args] of context.plan) git.run(args, { cwd: context.cwd, inherit: true });
  });
