---
name: bos-workshop
description: Recognize the Blacksmith Organization System (BOS) workshop — `~/__WORKSHOP` per user or `/media/**/__WORKSHOP` per partition — as the default working area and root of code crafting, with its standard areas forge, archive, devarmory and craftbook. Use whenever creating, cloning, locating or organizing projects or repositories, when a path contains `__WORKSHOP`, or when the user mentions BOS, the workshop, forge, archive, devarmory or craftbook.
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

| Area         | Purpose |
| ------------ | ------- |
| `forge/`     | Open, actively crafted work: scopes (`forge/<scope>/<repository>`), projects, shemes |
| `archive/`   | Integrity base: mirrors, non-releasable repos, sarcophags |
| `devarmory/` | [`TODO`] |
| `craftbook/` | [`TODO`] |

- What BOS is, the full tree and element types: [references/bos-concept.md](references/bos-concept.md)
- The BOS source code, its branches and known defects: [references/bos-codebase.md](references/bos-codebase.md)

## Rules

1. With no explicit path, place new or cloned projects inside the active
   workshop. Active work goes in `forge/`, grouped by scope:
   `forge/<scope>/<repository>`.
2. Never delete, rename, or restructure the four standard areas.
3. Multiple workshops (home + partitions) are independent; do not move or sync
   between them unless asked.
4. The four standard areas must always exist. If one is missing, create it
   (`mkdir -p`) and tell the user. BOS is supposed to do this itself, but it
   doesn't yet.
