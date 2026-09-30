# __WORKSHOP — Blacksmith Organization System (BOS) root

Default guideline for all LLMs and AI agents (Claude Code, Codex, Gemini CLI,
Copilot, Cursor, Aider, and any other agent) working on this machine.

## Recognizing the workshop

A directory named `__WORKSHOP` is the **standard working area** and the
**default root of code crafting** in the Blacksmith Organization System (BOS).
Treat it as such in most cases, unless the user says otherwise.

| Scope         | Path                        | Meaning                                  |
| ------------- | --------------------------- | ---------------------------------------- |
| Per user      | `~/__WORKSHOP`              | The user's home workshop                 |
| Per partition | `/media/**/__WORKSHOP`      | A workshop living on a mounted partition |

Rules:

1. When asked to create, clone, or look for a project without an explicit path,
   assume it belongs inside a workshop — by default `~/__WORKSHOP`.
2. When the current working directory is inside any `__WORKSHOP`, the nearest
   ancestor named `__WORKSHOP` is the active workshop root.
3. Several workshops may exist at once (home + partitions). Do not merge, move,
   or sync between them unless the user asks.
4. Never delete or restructure the top-level workshop areas listed below.
5. The standard areas must always exist. If one is missing, create it and
   tell the user. (BOS does this at boot, but don't rely on BOS running.)

## Standard areas

Every workshop always contains these areas:

```
__WORKSHOP/
├── .BOS/         BOS itself (internal): setup, data, nests, storylines
├── devarmory/    tools
├── forge/        active work
├── craftbook/    notes, recipes, procedures
└── archive/      work at rest
```

### `.BOS/`

Internal area where BOS keeps itself: `setup/` (SSH keys, VPN, routing, DNS/SSH
aliases, tokens), `data/`, `nests/` (container and VM volumes), `storylines/`
(shell history, logs, origin metadata). Don't put crafted work here.

### `forge/`

Center of the craftspace: what is open and in focus right now. Grouped by scope
(formerly "superproject"): `forge/<scope>/<repository>`.

### `archive/`

Integrity base: non-releasable repos and mirrors that buffer between the forge
and remote servers. Holds sarcophags (encrypted containers, one bare repo each).

### `devarmory/`

The developer's armory: custom tools outside the standard `bin`, AppImages,
containerized build environments, IDE sets. Listed in a manifest with
checksums, so missing or damaged tools can be detected and restored.

### `craftbook/`

Knowledge: scrapnotes (every note or draft not yet promoted to a document, in
`craftbook/scrapnotes/`), craftsets (reusable kits of notes, notebooks, one-off
scripts and session setup) and recipes.

## Conventions

- Naming of projects and directories: [`TODO`]
- Grouping of related repositories: `forge/<scope>/<repository>`
- Every project carries the standard anatomy: `README.md`, `LICENSE`,
  `AGENTS.md` (+ `CLAUDE.md` importing it), `Taskfile.yml`, `src/`, `docs/`,
  `tests/`, `.github/`
- Branches of every repository: `master` (spine of canon) → `developement`
  (here we code) → `revision` → `testing` → `releasing` → back to `master`
  through a pull request. Work on `developement`, never directly on `master`.
- Git / remotes policy: scope repositories are private, kept on a self-hosted server (e.g. Gitea) with pre-public drafts; public projects on GitHub (`Sarverott`); details [`TODO`]
- Moving work between areas (lifecycle): forge → archive → canon; details [`TODO`]

## BOS itself

BOS lives in the forge like any project:
`forge/blacksmith-organization-system/bos-skillset`
(https://github.com/Sarverott/blacksmith-organization-system).
This file is deployed from its `resources/workshop-root/` by `bos bootstrap`.

- `bos status` shows the workshop tree and what is missing; `bos open` / `bos close` run the procedures
- definition of every element, one page each: `bos-skillset/docs/glossary/`
- agent skill: `bos-skillset/skills/bos-workshop/`
