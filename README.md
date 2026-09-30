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
git clone https://github.com/Sarverott/blacksmith-organizing-system.git bos-skillset
cd bos-skillset && npm install && npm link   # `bos` on PATH

bos status      # workshop tree, what is missing (read-only)
bos open        # create missing areas, record the opening
bos close       # keep shell history as a ttystory, record the closing
bos repl        # every command at an interactive prompt
```

More: [preinstall](docs/tutorials/preinstall.md) ·
[installation](docs/tutorials/installation.md) ·
[getting started](docs/tutorials/GETTING_STARTED.md) ·
[first use](docs/tutorials/first-use-example.md) ·
[logicflows](docs/tutorials/logicflow-explanation.md)

## Skills

| Skill | Description |
| ----- | ----------- |
| [`bos-workshop`](skills/bos-workshop/SKILL.md) | Recognize workshops, their areas and elements; place work where it belongs |

```
/plugin marketplace add Sarverott/blacksmith-organizing-system
/plugin install bos-skills@bos-skillset
```

Or link one skill manually: `ln -s "$PWD/skills/bos-workshop" ~/.claude/skills/bos-workshop`.
New skills start from `template/SKILL.md` and are registered in `.claude-plugin/marketplace.json`.

## Repository layout

```
src/
├── main.ts         spine (class BOS)          ├── controllers/  management methods
├── core/           skeleton logic             ├── commands/     index.json per command
├── bridge/         docker, github, git, gitea ├── views/        status tree, help, repl
├── models/         workshop assets            ├── cli.mjs       bos
├── procedures/     protocols, step per file   └── index.mjs     library entry
resources/  tests/  docs/  skills/  template/  .claude-plugin/
Taskfile.yml  Dockerfile  compose.yaml  AGENTS.md  CLAUDE.md
```

Details and the reasons behind the split: [AGENTS.md](AGENTS.md).

## Branches

`master` (spine of canon) → `developement` (here we code) → `revision` →
`testing` → `releasing` → `master` through a pull request.
See [branch movement procedures](docs/infographics/branch-movement-procedures.md); `bos promote` walks it.

## License

MIT — see [LICENSE](LICENSE).
