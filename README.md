```
      █▄▄ █░░ ▄▀█ █▀▀ █▄▀ █▀ █▀▄▀█ █ ▀█▀ █░█
      █▄█ █▄▄ █▀█ █▄▄ █░█ ▄█ █░▀░█ █ ░█░ █▀█

   █▀█ █▀█ █▀▀ ▄▀█ █▄░█ █ ▀█ ▄▀█ ▀█▀ █ █▀█ █▄░█
   █▄█ █▀▄ █▄█ █▀█ █░▀█ █ █▄ █▀█ ░█░ █ █▄█ █░▀█

             █▀ █▄█ █▀ ▀█▀ █▀▀ █▀▄▀█
             ▄█ ░█░ ▄█ ░█░ ██▄ █░▀░█
```
> ###### [Sett Sarverott](https://github.com/Sarverott) @ 2019-2026

# Blacksmith Organization System

Tools, procedures and agent skills for the **Blacksmith Organization System
(BOS)**: an ordered digital workshop. `~/__WORKSHOP` (per user) and
`/media/**/__WORKSHOP` (per partition) are the root of code crafting, with
the same shape on every host:

```
__WORKSHOP/
├── .BOS/        BOS itself: setup, data, nests, storylines
├── devarmory/   tools
├── forge/       active work: <scope>/<project>
├── craftbook/   notes, recipes, procedures
└── archive/     work at rest
```

What each element means: [docs/glossary](docs/glossary/README.md).

## Quick start

```bash
cd ~/__WORKSHOP/forge/blacksmith-organization-system
git clone https://github.com/Sarverott/blacksmith-organization-system.git bos-skillset
cd bos-skillset && npm install && npm link   # `bos` on PATH

bos workshop status      # workshop tree, what is missing (read-only)
bos workshop open        # create missing areas, record the opening
bos workshop close       # keep shell history as a ttystory, record the closing
bos repl        # every command at an interactive prompt
```

Documentation site: built from `docs/` with MkDocs on Read the Docs (`task docs:serve` to preview).

More: [preinstall](docs/tutorials/preinstall.md) ·
[installation](docs/tutorials/installation.md) ·
[getting started](docs/tutorials/GETTING_STARTED.md) ·
[first use](docs/tutorials/first-use-example.md) ·
[logicflows](docs/tutorials/logicflow-explanation.md)

## Skills

| Skill | Description |
| ----- | ----------- |
| [`bos-workshop`](skills/bos-workshop/SKILL.md) | Recognize workshops, their areas and elements; place work where it belongs |
| `bos-devarmory` `bos-forge` `bos-craftbook` `bos-archive` | the crafting areas (drafts) |
| `bos-scope` `bos-project` `bos-sheme` `bos-throwbox` `bos-sarcophag` `bos-exhibit` `bos-craftset` | the assets inside them (drafts) |

A model's skill is drafted from its glossary page by `bos project skills` and then grown by hand.

BOS is also a Claude Code plugin, an agent's suit: a session brief, read-only
MCP tools over the workshop and the House, `bos` on PATH, the skills, and the
agent's work recorded in storylines ([agent suit](docs/tutorials/agent-suit.md)):

```
/plugin marketplace add ~/__WORKSHOP/forge/blacksmith-organization-system/bos-skillset
/plugin install bos@bos-skillset
```

Or link one skill manually: `ln -s "$PWD/skills/bos-workshop" ~/.claude/skills/bos-workshop`.
New skills start from `template/SKILL.md` and are registered in `.claude-plugin/marketplace.json`.

## Repository layout

```
src/
├── main.ts         spine (class BOS)          ├── controllers/  remotes: execution, workshop, house, repository
├── core/           skeleton logic, toolkit    ├── views/        text, help, repl, MCP, agent brief
├── bridge/         docker, github, git, gitea ├── cli.mjs       bos <model> <tool>
├── models/         assets + their toolkits    └── index.mjs     library entry
├── procedures/     protocols, step per file
resources/  tests/  docs/  skills/  template/  .claude-plugin/
Taskfile.yml  Dockerfile  compose.yaml  AGENTS.md  CLAUDE.md
```

Details and the reasons behind the split: [AGENTS.md](AGENTS.md).

## Branches

`master` (spine of canon) → `developement` (here we code) → `revision` →
`testing` → `releasing` → `master` through a pull request.
See [branch movement procedures](docs/infographics/branch-movement-procedures.md); `bos project promote` walks it.
Every push releases: `x.y.z-dev.N` from developement, `-beta.N` from testing, `-rc.N`
from releasing, `x.y.z` from master, on npm, GitHub Packages and ghcr.io
([committing and releasing](docs/tutorials/committing-and-releasing.md)).

## License

MIT — see [LICENSE](LICENSE).
