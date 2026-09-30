# AGENTS.md: blacksmith-organizing-system

Instructions for AI agents working **on this repository**. For working
anywhere in a workshop, see `resources/workshop-root/AGENTS.md` (deployed to
every workshop root as `__WORKSHOP/AGENTS.md`).

## Where this project sits

This is the new core of the Blacksmith Organization System (BOS). It is itself
a BOS project, so its path tells its place in the machine:

```
~/__WORKSHOP/                              workshop (root of crafting on this host)
└── forge/                                 active work
    └── blacksmith-organization-system/    scope (family of BOS repositories)
        ├── bos-skillset/                  ← this project (github: Sarverott/blacksmith-organizing-system)
        └── blacksmith-organization-system/  the old core (history, glossary origin)
```

`node src/cli.mjs locate` prints this place as BOS computes it.

## Meaning before code

`docs/glossary/` defines every element (workshop, forge, scope, sarcophag…),
one page each. The author annotates it directly; read their changes before
changing code. `src/models/<element>/class.mjs` is the glossary expressed as classes:
keep the two consistent, and write the page first when adding an element.

## Architecture

```
src/
├── main.ts         spine: class BOS, binds the core and loads every part lazily
├── core/           skeleton logic: basic-model, -procedure, -controll, -view, -bridge, self
├── bridge/         outside systems shaped into plain methods, one directory each
├── models/         actors: the physical assets of the workshop, one directory each;
│                   organs of an asset hang on it as models/<owner>/hang.<name>.mjs
├── procedures/     steps that close routed routines: DESCRIPTION.md + one file per step
├── controllers/    simplified management: plain methods that run procedures
├── commands/       what people call: index.json (path, info, help, inline, repl) per command
├── views/          how BOS presents itself: text for people, json for machines, repl
├── cli.mjs         `bos`: parse, load, dispatch, print
└── index.mjs       library entry
```

| Part | Role | Extends |
| ---- | ---- | ------- |
| core + `main.ts` | the spine: execution order and the mechanics everything shares | |
| bridges | one handler per outside system: `docker-host` (dockerode), `github-api` (octokit), `git-client` (isomorphic-git; local repos and Gitea remotes), `gitea-api` (fetch), `subprocess-runner`, … | `BOS.Bridge` |
| models | standalone assets of `docs/glossary/` (workshop, forge, scope, project, sarcophag…), built from a path | `BOS.Model` |
| submodules | organs that exist only inside their owner (`.BOS` internals, `storylines/logs`, `craftbook/scrapnotes`), built from the owner and reached as properties: `workshop.storylines.logs` | `BOS.Submodule` |
| procedures | locating → loading → bootstrapping / inspecting / opening / closing / sinking / hooking / promoting; skilling | `BOS.Procedure` |
| controllers | `bos.workshop` (`status()`, `open()`, `close()`, `sink()`, `promote()`…), `bos.skills` (`scaffold()`) | `BOS.Controll` |
| commands | loaded from `commands/<name>/index.json`; `inline` for the CLI or an API, `repl` for interactive use; `mode` names the mode of work it serves (glossary: mode) | |
| views | status tree, help, promotion, inventory, repl; colors off for pipes and `NO_COLOR` | `BOS.View` |

Models and submodules share one anatomy (`core/basic-element.mjs`: dirname,
descriptors, children, ensure, inspect, seal, verify). To reshape an organ
freely, change `extends BOS.Submodule` to `extends BOS.Model`, edit it, then
roll it back: nothing else in the file changes.

Every model can grow an agent skill: `bos skills` drafts
`skills/bos-<type>/SKILL.md` from the glossary page and the model, for models
that have none. Drafts are never overwritten; grow them by hand.

Every part imports the spine the same way: `import { BOS } from "../../main.ts"`
(Node ≥ 22.18 runs `.ts` directly). The spine never imports parts at load time,
only in `bos.load()`, so there are no import cycles.

## Why the code is scattered into small files

- **One concern per file.** A step, a bridge helper or a model is small enough
  to read whole, and its path says what it is (`procedures/closing/capture-ttystory.mjs`).
- **Revisions don't collide.** The owner and agents work in parallel. When the
  owner revises one file, an agent's next change to another file doesn't
  overwrite it. Long files turn every change into a merge of everything.
- **Feedback has an address.** A comment on one small file is about one thing,
  and a rejected piece can be replaced without touching the rest.
- **The tree is the documentation.** Directories and `_index.mjs` files show
  the structure. `DESCRIPTION.md` explains why a procedure exists; the code
  only says how.

So: add a new file rather than growing an old one, collect it in the nearest
`_index.mjs`, and keep each file to one responsibility.

## Rules

1. Procedures are code. A new BOS behaviour is a procedure step in its own
   file, assembled in `procedures/<name>/_index.mjs` and described in its `DESCRIPTION.md`.
2. BOS creates only what is missing and never overwrites or deletes. Keep
   every write behind `createIfMissing` or an explicit, dry-run-aware step.
3. Outside systems are reached only through bridges: dockerode, octokit and
   isomorphic-git live there, nowhere else.
4. Test against a temporary workshop (`--workshop=` / `BOS_WORKSHOP`), never the real one. Run `task test`.
5. Branch flow: work on `developement`; `bos promote` moves it to `revision` →
   `testing` → `releasing` → `master` (pull request). Never commit to `master` directly.
6. The owner works in parallel with agents. Re-check `git status` and the tree
   before acting, and treat what you find as intended.
7. Unknowns are marked [`TODO`]; don't invent meanings. Mark interpretations *(assumed)*.
