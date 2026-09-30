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
changing code. `src/models/class.mjs` is the glossary expressed as classes:
keep the two consistent, and write the page first when adding an element.

## Architecture

| Path | Role |
| ---- | ---- |
| `src/core/basic-model.mjs` | element anatomy: directory + descriptor files; `ensure` (create missing, never overwrite), `inspect`, `seal` / `verify` (checksums) |
| `src/core/basic-procedure.mjs` | ordered named steps over one context; `chain` composes |
| `src/core/basic-controll.mjs` | runs a named logicflow with a prepared context |
| `src/core/basic-view.mjs` | one handler for every presentation (text, json) |
| `src/core/basic-bridge.mjs` | outside tools (git, gh, docker) behind one call shape |
| `src/core/logicflows/` | the procedures: env-read, setup-load, bootstrap, open/close-workshop, hook-handlers, ci-cd |
| `src/models/class.mjs` | the elements: Workshop, System (.BOS), areas, artefacts, HOST_ROLES |
| `src/cli.mjs` | `bos` command; `src/index.mjs` library entry |
| `resources/` | defaults and files BOS deploys into workshops |
| `skills/` | agent skills (Claude Code plugin marketplace) |

## Rules

1. Procedures are code. A new BOS behaviour is a logicflow step, not a manual
   instruction; register it in `src/core/logicflows/_index.mjs`.
2. BOS creates only what is missing and never overwrites or deletes. Keep
   every write behind `createIfMissing` or an explicit, dry-run-aware step.
3. No runtime dependencies: Node ≥ 22 built-ins only. Outside tools go through a bridge.
4. Test against a temporary workshop (`--workshop=` / `BOS_WORKSHOP`), never the real one. Run `task test`.
5. Branch flow: work on `developement`; `bos promote` moves it to `revision` →
   `testing` → `releasing` → `master` (pull request). Never commit to `master` directly.
6. The owner works in parallel with agents. Re-check `git status` and the tree
   before acting, and treat what you find as intended.
7. Unknowns are marked [`TODO`]; don't invent meanings. Mark interpretations *(assumed)*.
