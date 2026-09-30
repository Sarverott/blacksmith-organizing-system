# Getting started

| Command | What happens |
| ------- | ------------ |
| `bos locate` | finds the active workshop: `--workshop`, then `$BOS_WORKSHOP`, then the nearest parent `__WORKSHOP`, then the one BOS itself sits in, then `~/__WORKSHOP` |
| `bos status` | shows the tree: `ok`, `MISSING` (mandatory, absent) or `not yet` (appears with use) |
| `bos bootstrap --dry-run` | lists what would be created |
| `bos bootstrap` | creates missing areas, descriptors and `AGENTS.md` / `CLAUDE.md`, and never overwrites |
| `bos open` | bootstrap, then records the opening in `.BOS/storylines/logs/workshop.jsonl` |
| `bos close` | copies shell history to `.BOS/storylines/ttystories/ttystory-<host>-<unixusat>.txt` and records the closing. Run `history -a` first so the current shell is included |
| `bos sink` | read-only inventory for the sinking protocol: forge projects with branch and uncommitted work, plus ttystories |
| `bos repl` | an interactive prompt for every command; `status` there offers to create what is missing |
| `bos mode [name\|digit]` | switches the mode of work; without an argument, a menu that takes one digit (0 leaves) |
| `bos skills [--dry-run]` | drafts an agent skill for every model that has none (in this repository) |
| `bos help [command]` | the command list, or one command's help |
| `bos seal <dir>` / `bos verify <dir>` | writes, or checks, the checksums of `<dir>` in its manifest |
| `bos hooks install` | inside a repository, links its git hooks to BOS, so commits, checkouts and merges land in storylines |
| `bos promote [--reject] [--apply]` | moves the current branch one station along the branch flow |

Add `--json` to any command for machine-readable output.

Give the host its role in `.BOS/workshop.json`:

```json
{ "name": "home", "role": "forging-point", "setternet": null, "mode": "smeltry" }
```

Modes: `almanac`, `conform`, `smeltry`, `commandorate`, `provision` ([mode](../glossary/mode.md)).

Roles: `masters-outpost`, `forging-point`, `trial-hall`, `market-stall`,
`canon-monolith`, `side-catacomb` ([host role](../glossary/host-role.md)).

Next: [first use](first-use-example.md)
