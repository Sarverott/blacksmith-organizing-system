# Getting started

| Command | What happens |
| ------- | ------------ |
| `bos workshop locate` | finds the active workshop: `--workshop`, then `$BOS_WORKSHOP`, then the nearest parent `__WORKSHOP`, then the one BOS itself sits in, then `~/__WORKSHOP` |
| `bos workshop status` | shows the tree: `ok`, `MISSING` (mandatory, absent) or `not yet` (appears with use) |
| `bos workshop bootstrap --dry-run` | lists what would be created |
| `bos workshop bootstrap` | creates missing areas, descriptors and `AGENTS.md` / `CLAUDE.md`, and never overwrites |
| `bos workshop open` | bootstrap, then records the opening in `.BOS/storylines/logs/workshop.jsonl` |
| `bos workshop close` | copies shell history to `.BOS/storylines/ttystories/ttystory-<host>-<unixusat>.txt` and records the closing. Run `history -a` first so the current shell is included |
| `bos workshop sink` | read-only inventory for the sinking protocol: forge projects with branch and uncommitted work, plus ttystories |
| `bos repl` | an interactive prompt for every command; `status` there offers to create what is missing |
| `bos workshop mode [name\|digit]` | switches the mode of work; without an argument, a menu that takes one digit (0 leaves) |
| `bos project skills [--dry-run]` | drafts an agent skill for every model that has none (in this repository) |
| `bos help [command]` | the command list, or one command's help |
| `bos project seal <dir>` / `bos project verify <dir>` | writes, or checks, the checksums of `<dir>` in its manifest |
| `bos project install-hooks` | inside a repository, links its git hooks to BOS, so commits, checkouts and merges land in storylines |
| `bos project promote [--reject] [--apply]` | moves the current branch one station along the branch flow |

Add `--json` to any command for machine-readable output.

A new workshop starts as a **forging point** in **CONFORM** mode: a
developer's playground, focused on installing and configuring. `bos workshop status`
marks values that come from defaults with `(default)`. To change them, set
them in `.BOS/workshop.json`:

```json
{ "name": "home", "role": "forging-point", "setternet": null, "mode": "smeltry" }
```

Modes: `almanac`, `conform`, `smeltry`, `commandorate`, `provision` ([mode](../glossary/mode.md)).

Roles: `masters-outpost`, `forging-point`, `trial-hall`, `market-stall`,
`canon-monolith`, `side-catacomb` ([host role](../glossary/host-role.md)).

Next: [first use](first-use-example.md)
