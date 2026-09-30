# Procedures (logicflows)

A procedure is a list of ordered, named steps that share one context object
(`BOS.Procedure`, `src/core/basic-procedure.mjs`). Procedures chain into
longer ones. Every run leaves `context.trace` (step, ok, ms) and
`context.changes` (paths created, or planned in a dry run).

Each procedure has its own directory in `src/procedures/`:

```
procedures/closing/
├── DESCRIPTION.md          why it exists
├── capture-ttystory.mjs    one step
├── record-closing.mjs      one step
└── _index.mjs              assembly: loading.chain(steps)
```

| Procedure | Steps |
| --------- | ----- |
| locating | read environment → locate workshop → locate self |
| loading | locating → load workshop config → validate host role |
| inspecting | loading → inspect tree (read-only) |
| bootstrapping | loading → ensure workshop tree → deploy agent guides |
| opening | bootstrapping → record opening |
| closing | loading → capture ttystory → record closing |
| sinking | loading → inventory forge → inventory tools (read-only so far) |
| hooking | loading → record hook; installingHooks: locating → link hooks |
| promoting | read position → plan → apply (only with `--apply`, clean worktree) |
| skilling | collect models → compose skills → write missing skills → register in marketplace |

Controllers run them as plain methods:

```js
import { BOS } from "blacksmith-organization-system";

const bos = await new BOS().load();
const context = await bos.workshop.status();     // runs "inspecting"
console.log(context.tree, context.trace);
```

To add a procedure:
1. Create `src/procedures/<name>/` with `DESCRIPTION.md`, one file per step, and `_index.mjs`.
2. Register it in `src/procedures/_index.mjs`.
3. Give it a controller method and a test.
4. If people should call it, add `src/commands/<name>/` (`index.json`, `help.md`, `exec.mjs`).

Rules the procedures keep: create only what is missing, never overwrite,
respect `context.dryRun`, and record events in storylines.
