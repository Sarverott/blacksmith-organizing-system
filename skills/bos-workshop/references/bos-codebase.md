# BOS codebase map

Local clone: `~/__WORKSHOP/forge/blacksmith-organization-system/blacksmith-organization-system`
Node.js (CommonJS). Entry: `src/_index.js`. Run: `npm start` (`node src/_index.js`).

## Boot sequence

1. `src/_index.js` runs `runner.js` when executed directly, or exports `includer.js` (the library API) when required.
2. `runner.js` calls `BOS.INITIALIZE(repoRoot)`, then `BOS.SETUP()`, then `BOS.EXECUTE()` (EXECUTE is empty).
3. `core/bos.js` INITIALIZE loads every controller class and calls `Controller.loadAll()` in a fixed order:
   Config → Models → Commands → Interfaces → Scope → Scrapbook → Projects → Bridges → Factors → Sandbox → Publication → Deployment.
4. `ConfigControll` copies each `config/*.default` to its real name if missing, then loads `config/*.json` into `BOS.CONFIG`.
5. `ModelsControll` loads each model directory (`class.js`, `data.json`, `actions/`, `events/`, `listeners/`, `methods/`) and exposes it as `BOS.<Capitalized>`.
6. `ScopeControll` builds the workshop tree: it creates `Workshop`, `Archive`, `Scrapbook(notes)` and `Forge` objects. Each model constructor runs `mkdir -p` on its path and sets `fs.watch` on it.
7. `SETUP` copies `config/startup.bos.default` to `~/<context-path>/<startup>` and runs it as a BOS script.
   A BOS script has one command per line: `<command> <args...>`. The default is `use-interface cli-repl open`.
8. The `cli-repl` interface is a readline prompt that evaluates each line as JavaScript in a `vm` context (not as BOS commands).

Every model is a subclass of the `BlacksmithOrganizationSystem` EventEmitter
class in `core/bos.js`. Lifecycle methods (`open`, `create`, `close`, `move`, …)
emit `on-model-<name>` events on `BOS.EVENTS`.

## Branches

| | `master` (767aa95) | `developement` (ade23b9, 6 commits ahead) |
|-|-|-|
| Code layout | Everything in `src/<type>/` | Components split into 14 git submodules at `src/components/<type>/` (`Sarverott/bos.<type>`), code under `ITEMS/` |
| Core (`src/core`) | Loads from `src/controllers`, `src/models`, … | **Unchanged from master**, so it still points at paths that no longer exist → cannot start |
| Tooling | Shell scripts in `dev/` | Moved to the `bos.toolsets` component; JS `.craftset/` tooling in each component |
| Config | `main.json.default`, `startup.bos.default` | Adds `workshop.json.default` (forge/archive/craftbook/devarmory + hidden areas) |
| Models | archive, exhibit, forge, project, sarcophag, scheme, scrapbook, superproject, throwbox, workshop | archive, collection, craftset, forge, postroad, project, sarcophag, scope, scrapnote, sheme, throwbox, workshop |
| Deps | 5 runtime deps | ~37 runtime deps (openai, ollama, discord, puppeteer, …), mostly unused yet |

The submodule pointers in `developement` are pinned to each component's
template "Initial commit". The real migrated code is 3 commits later, on each
component's `origin/master`. `ITEMS/*` files are byte-identical to master's
`src/<type>/*` (checked 2026-09-30), except for model renames.

Commit messages marked `░▒▓BOS.helper.tulu3╚╣Skryba╠╗UNIXUSAT=…` come from
an automated commit-message helper. Several are garbled noise; don't read
meaning into them.

## `reforge` branch (2026-09-30, uncommitted)

A new branch built from `developement`, with the same branch name inside the
edited submodules. Main changes:

- Submodules point at each component's `origin/master` (the real code).
- Core loaders read `src/components/<type>/ITEMS` via `helpers.componentPath()`.
- Components require core via the package self-reference
  `blacksmith-organization-system/core/<file>` (`exports` in package.json), so
  their depth doesn't matter.
- The workshop root is resolved by `helpers.findWorkshopRoot()`:
  `$BOS_WORKSHOP` → nearest ancestor `__WORKSHOP` → `config/workshop.json` `path`
  (`~/__WORKSHOP`). Available as `BOS.WORKSHOP_ROOT` and `BOS.WorkshopPath(...)`.
- `ScopeControll` creates every missing area from `config/workshop.json` at boot.
- The startup script and CLI history live in `<workshop>/.SETUP/`.
- CLI commands are dot-commands: `.show-status`, `.deploy-workshop`,
  `.new-scope <name>`, `.pull-archive`, `.new-component <name>`, `.exit`.
- Model `fs.watch` is non-recursive. Event logging only runs with `BOS_DEBUG=1`.

Test safely with `BOS_WORKSHOP=/tmp/some/__WORKSHOP npm start`. Without it,
running from inside `~/__WORKSHOP` uses the real workshop.

## Known defects (on master / developement; fixed on reforge unless noted)

- `ScopeControll` builds the workshop at `BOS.PathTo(context-path)`, which is
  **inside the repository** (`<repo>/__WORKSHOP`), while `SETUP` writes the
  startup script to `~/__WORKSHOP/setup`. These are two different places.
- `SETUP` copies the startup file without creating `~/__WORKSHOP/setup/` first,
  so a fresh run crashes with ENOENT.
- The stub `exit` command overrides the REPL's built-in `.exit`, so `.exit` did nothing.
- CLI command arguments arrived as one unsplit string.
- Many command `call.js` files and model actions are empty stubs (still true: create-item, load-workshop).
- `developement` core loaders use old paths (see Branches).
