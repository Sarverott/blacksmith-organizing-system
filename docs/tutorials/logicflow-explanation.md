# Logicflows

A logicflow is a **procedure**: ordered, named steps sharing one context
object (`src/core/basic-procedure.mjs`). Flows are built by chaining smaller
ones, and every run leaves `context.trace` (step, ok, ms) and
`context.changes` (paths created, or planned in a dry run).

| Flow | Steps |
| ---- | ----- |
| `locate` = env-read | read environment (host, user, home, cwd, unixusat) → locate workshop → locate self |
| `status` | env-read → setup-load → inspect tree (read-only) |
| `bootstrap` | env-read → setup-load → ensure workshop tree → deploy agent guides |
| `open` | env-read → setup-load → bootstrap → record opening |
| `close` | env-read → setup-load → capture ttystory → record closing |
| `hook` | env-read → setup-load → record hook |
| `hooks-install` | env-read → link hooks |
| `promote` | read position → plan → apply (only with `--apply`) |

```js
import { BasicProcedure, WorkshopControll } from "blacksmith-organizing-system";

const context = await new WorkshopControll().run("status");
console.log(context.tree, context.trace);

// a new flow: steps are plain functions of the context
const hello = new BasicProcedure("hello").step("greet", (ctx) => { ctx.greeting = `hello ${ctx.env.user}`; });
```

To add a flow, write it in `src/core/logicflows/<name>.mjs`, register it in
`_index.mjs`, add a test in `tests/`, and a command in `src/cli.mjs` if people
should call it.

Rules the flows keep: create only what is missing, never overwrite, respect
`context.dryRun`, and record events in storylines.
