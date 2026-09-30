```
      █▄▄ █░░ ▄▀█ █▀▀ █▄▀ █▀ █▀▄▀█ █ ▀█▀ █░█
      █▄█ █▄▄ █▀█ █▄▄ █░█ ▄█ █░▀░█ █ ░█░ █▀█

   █▀█ █▀█ █▀▀ ▄▀█ █▄░█ █ ▀█ ▄▀█ ▀█▀ █ █▀█ █▄░█
   █▄█ █▀▄ █▄█ █▀█ █░▀█ █ █▄ █▀█ ░█░ █ █▄█ █░▀█

             █▀ █▄█ █▀ ▀█▀ █▀▀ █▀▄▀█
             ▄█ ░█░ ▄█ ░█░ ██▄ █░▀░█
```
> ###### [Sett Sarverott](https://github.com/Sarverott) @ 2019-2026

# Blacksmith Organization System

Package files, sourcecode of server, client for end-user access and agent skills for the **Blacksmith Organization System (BOS)**: a convention that
makes `~/__WORKSHOP` (per user) and `/media/**/__WORKSHOP` (per partition) the
default root of code crafting.

Part of the `blacksmith-organization-system` project group. It relates to many
other repositories: [`TODO`]

## Skills

| Skill | Description |
| ----- | ----------- |
| [`bos-workshop`](skills/bos-workshop/SKILL.md) | Recognize `__WORKSHOP` roots and their standard areas (forge, archive, devarmory, craftbook) |

## Repository layout

```
bos-skillset/
├── .claude-plugin/
│   └── marketplace.json      # plugin marketplace manifest (Claude Code)
├── skills/                   # one directory per skill
│   └── bos-workshop/
│       ├── SKILL.md          # required: frontmatter + instructions
│       ├── references/       # docs loaded on demand (bos-concept, bos-codebase)
│       ├── scripts/          # executable helpers
│       └── assets/           # templates, files used in output
├── template/
│   └── SKILL.md              # starting point for new skills
├── LICENSE
└── README.md
```

## Installation

### Claude Code (plugin marketplace)

```
/plugin marketplace add <path-or-repo-url>   # [`TODO`] repository URL
/plugin install bos-skills@bos-skillset
```

### Manual

Copy or symlink a skill directory into the agent's skills folder, e.g.:

```bash
ln -s "$PWD/skills/bos-workshop" ~/.claude/skills/bos-workshop
```

Other agents: [`TODO`]

## Adding a skill

1. Copy `template/` to `skills/<skill-name>/`.
2. Fill in the `name` and `description` frontmatter in `SKILL.md`.
3. Register the skill path in `.claude-plugin/marketplace.json`.
4. Add it to the table above.

## License

MIT — see [LICENSE](LICENSE).
