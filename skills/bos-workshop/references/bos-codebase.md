# BOS codebase map

## New core: this repository (bos-skillset → Sarverott/blacksmith-organization-system)

Node ≥ 22.18, ESM plus `src/main.ts` (run directly via type stripping). Read the
root `AGENTS.md` first: it has the architecture and the one-concern-per-file rule.

- `src/main.ts`: the spine. `class BOS` holds `BOS.Bridge/Model/Procedure/Controll/View`; `bos.load()` loads the parts; `bos.workshop` is the controller; `bos.command(name)`.
- `src/bridge/<name>/`: docker-host (dockerode: containers, images, volumes), github-api (octokit), git-client (isomorphic-git), gitea-api, subprocess-runner, docker-publish, npm-publish, ssh-link, bos-instances-link ([`TODO`])
- `src/models/<element>/class.mjs`: standalone assets (`BOS.Model`); organs hang on their owner as `models/<owner>/hang.<name>.mjs` (`BOS.Submodule`, built from the owner: `workshop.storylines.logs`); shared anatomy in `core/basic-element.mjs`; `models/workshop/locate.mjs` finds workshops
- `bos skills`: drafts `skills/bos-<type>/SKILL.md` per model from the glossary (procedure `skilling`), never overwrites
- `src/procedures/<name>/`: DESCRIPTION.md + a step per file: locating, loading, inspecting, bootstrapping, opening, closing, sinking, hooking, promoting
- `src/commands/<name>/index.json`: `{path, info, help, inline, repl}`; `bos help` lists them
- storylines log: `.BOS/storylines/logs/workshop.jsonl`; tests: `npm test` (vitest)
- commits: husky (`.husky/`) → `bos describe --hook` drafts a conventional commit, Skryba (raven, `resources/ravens/skryba.md`, via ollama-link) refines it, commitlint checks it, post-* hooks → storylines; `npm run commit` = commitizen (cz-commitlint)
- releases: semantic-release (`release.config.mjs`), baseline tag v0.7.0; channels dev (developement), beta (testing), rc (releasing), latest (master); npm + GitHub Packages (@sarverott/…) + ghcr.io

Everything below describes the **old core**.

---

Local clone: `~/__WORKSHOP/forge/blacksmith-organization-system/blacksmith-organization-system`
Remote: https://github.com/Sarverott/OLD-VERSIONS_blacksmith-organization-system (renamed; the name now belongs to the new core)
Node.js (CommonJS). Entry: `src/_index.js`. Run: `npm start`.

The owner works in this repo in parallel with agents: new commits, removed
files and changed remote branches between sessions are normal. Always re-check
`git status`, `git log --all` and the tree before acting. Don't assume an
earlier state.

## Branches (as of 2026-09-30)

| Branch | State |
| ------ | ----- |
| `developement` | Main dev line. Being cleaned radically by the owner ("massive removal of junk codes from dark past", c7da0df) |
| `dev/reforge` | The agent's reforge work (4d71a58): the component-submodule layout, booting |
| `dev/submodule-gits` | `developement` before the reforge (ade23b9): 14 component submodules, not booting |
| `drafting`, `moderation`, `publishing`, `testing`, `revision`, `releasing` | Workflow branches, created at ade23b9, not used yet |
| `master` | Old, single-repo version (767aa95). Boots, but builds the workshop inside the repo |

`developement/…` names are impossible while a `developement` branch exists
(a git ref can't be both a branch and a folder), so sub-branches use `dev/…`.

Commit messages marked `░▒▓BOS.helper.tulu3╚╣Skryba╠╗UNIXUSAT=…` come from an
automated commit-message helper. Several are garbled noise.

## Layout of `developement` after the clean-up (c7da0df)

Submodules are gone. The component code is flat again in `src/<type>/`:

```
src/
├── _index.js runner.js spawner.js includer.js
├── core/          bos.js (base class + INITIALIZE/SETUP), bos.controller.js,
│                  bos.command.js, bos.interface.js, helperFunctions.js
├── controllers/   Config, Models, Commands, Interfaces, Scope, … (*Controll.js)
├── commands/      <name>/{call.js,index.json,manual.md}
├── models/        <type>/{class.js,data.json[,README.md]}; archive keeps actions/events/…
├── factors/       command-factory.js
├── bridges/       integration stubs (publishers, extensions, integrators)
└── toolsets/      old shell scripts + dev/_index.js save/test runner
resources/cli-art/ text-art logos
docs/              README, devlog, about-*.md, glossary/
```

Removed in the clean-up: `config/` (main/workshop/startup defaults),
`src/interfaces/` (cli-repl, http-api, socket-server), `libs/py`, `apps/`,
`examples/`, `.crovley`, all submodules.

## Boot sequence (design)

1. `_index.js` runs `runner.js` when executed directly, or exports `includer.js` (the library API) when required.
2. `runner.js` calls `BOS.INITIALIZE(repoRoot)`, `BOS.SETUP()`, `BOS.EXECUTE()` (EXECUTE is empty).
3. INITIALIZE loads every controller class and calls `loadAll()`: Config → Models → Commands → Interfaces → Scope → Scrapbook → Projects → Bridges → Factors → Sandbox → Publication → Deployment.
4. Config loads `config/*.json` (copied from `*.default` if missing) into `BOS.CONFIG`.
5. Models are exposed as `BOS.<Type>` and `BOS.MODELS[type]`.
6. Scope builds the workshop tree from `BOS.CONFIG.workshop.content` and creates missing areas.
7. SETUP runs `<workshop>/.SETUP/startup.bos`: one command per line, `<command> <args…>`. The default is `use-interface cli-repl open`.
8. `cli-repl` is Node's REPL. BOS commands are dot-commands (`.show-status`).

## Current boot state of `developement` (c7da0df): does not start

Leftovers from the reforge still point at the removed layout:

- `core/helperFunctions.js` `componentPath()` returns `src/components/<type>/ITEMS/…`. It should become `src/<type>/…`.
- `controllers/InterfacesControll.js`, `ModelsControll.js`, `CommandsControll.js` join `"src","components",<type>,"ITEMS"`.
- `require("blacksmith-organization-system/core/…")` (package self-reference) still works while `package.json` has `exports`. Relative `../core/…` would work again now too.
- `config/` is gone, but ConfigControll, Scope and SETUP need `main.json` and `workshop.json` (defaults).
- `src/interfaces/` is gone, but the startup script and InterfacesControll expect it.
- `commands/new-component` still does `git submodule add … src/components/<name>`.

Workshop root resolution (still in `helperFunctions.findWorkshopRoot`):
`$BOS_WORKSHOP` → nearest ancestor `__WORKSHOP` → `~/__WORKSHOP`.
Test safely with `BOS_WORKSHOP=/tmp/x/__WORKSHOP npm start`. Without it,
running from inside `~/__WORKSHOP` uses the real workshop.

## Commands (src/commands)

| Command | Does |
| ------- | ---- |
| `show-status [workshop\|workshops\|forge\|archive\|interfaces\|tree]` | readable status |
| `deploy-workshop` | create missing areas, write `bos-workshop.log` (port of deploy-new-workshop.sh) |
| `new-scope <name>` | `forge/<name>` + `git init` (port of new-superproject.sh; the old one made a bare `<name>.git`) |
| `pull-archive` | clone or fetch the repos in `.DATA/*.gitlist` into `archive/<pack>/` (port of archive_mirrors.sh) |
| `new-component <name>` | `gh repo create bos.<name>` from template + submodule (outdated since submodules were removed) |
| `exit` | closes the REPL |
| `use-interface <name> open` | starts an interface |
| `create-item`, `load-workshop` | empty stubs |

## Historic defects fixed in `dev/reforge`

- master built the workshop inside the repo (`BOS.PathTo(context-path)`) but wrote the startup script to `~/__WORKSHOP/setup`.
- SETUP copied the startup file without creating its directory (ENOENT on a fresh run).
- A stub `exit` command overrode the REPL's built-in `.exit`.
- CLI command arguments arrived as one unsplit string.
- A recursive `fs.watch` on every model; every file change dumped whole objects to the console.
