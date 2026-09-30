---
name: bos-workshop
description: Recognize the Blacksmith Organization System (BOS) workshop — `~/__WORKSHOP` per user or `/media/**/__WORKSHOP` per partition — as the default working area and root of code crafting, with its internal `.BOS/` and crafting areas forge, archive, devarmory and craftbook. Use whenever creating, cloning, locating or organizing projects, repositories, tools or notes, when a path contains `__WORKSHOP`, or when the user mentions BOS, the workshop, forge, archive, devarmory, craftbook, scope, sheme, throwbox, sarcophag, scrapnote, craftset or setternet.
---

# BOS Workshop

The Blacksmith Organization System (BOS) defines a `__WORKSHOP` directory as the
standard working area and default root of code crafting.

## Workshop roots

- **Per user:** `~/__WORKSHOP`
- **Per partition:** `/media/**/__WORKSHOP` (any mounted partition)

To find the active workshop, run `scripts/find-workshop.sh` (prints the active
root first, then all other workshops found). Resolution order:

1. `$BOS_WORKSHOP` environment variable, if set
2. Nearest ancestor of the current directory named `__WORKSHOP`
3. `~/__WORKSHOP`

## Standard areas

Every workshop always contains:

| Area         | Holds |
| ------------ | ----- |
| `.BOS/`      | BOS itself (internal): `setup/` (keys, VPN, aliases, tokens), `data/`, `nests/` (container/VM volumes), `storylines/` (shell history, logs), `workshop.json`, `Taskfile.yaml` |
| `devarmory/` | Tools: custom binaries, AppImages, build containers, IDE sets; listed in a manifest with checksums |
| `forge/`     | Active work: scopes (`forge/<scope>/<repository>`), projects, shemes, throwbox |
| `craftbook/` | Knowledge: scrapnotes (all notes not yet documents), craftsets (reusable procedure kits), recipes |
| `archive/`   | Work at rest: sarcophags (encrypted bare repos), exhibits, mirrors |

Where things go: code you are working on → `forge/<scope>/`; a tool → `devarmory/`;
a note or draft → `craftbook/scrapnotes/`; a mirror or closed repo → `archive/`;
graphics, CAD, photos or templates for a scope → a sheme inside that scope.

- What BOS is, the full tree and element types: [references/bos-concept.md](references/bos-concept.md)
- The BOS source code, its branches and current state: [references/bos-codebase.md](references/bos-codebase.md)
- One page per element (workshop, forge, scope, sarcophag, …): `docs/glossary/` in the BOS repo

## Rules

1. With no explicit path, place new or cloned projects inside the active
   workshop. Active work goes in `forge/`, grouped by scope:
   `forge/<scope>/<repository>`.
2. Never delete, rename, or restructure the standard areas.
3. Multiple workshops (home + partitions) are independent; do not move or sync
   between them unless asked.
4. The standard areas (`.BOS/` and the four crafting areas) must always exist. If one is missing, create it
   (`mkdir -p`) and tell the user. BOS does this itself when it boots (since
   `dev/reforge`), but don't rely on BOS running.
5. The owner works on BOS repositories in parallel with agents. Re-check the
   git state and file tree before acting, and treat what you find as intended.
