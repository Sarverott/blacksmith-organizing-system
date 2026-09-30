# Preinstall

Needed:

- **Node.js ≥ 22**: BOS uses only Node built-ins at runtime
- **git**

Optional:

- **Task** (taskfile.dev): installed with the dev dependencies as `@go-task/cli`; runs `Taskfile.yml`
- **gh**: pull requests in `bos promote` (releasing → master)
- **Docker**: run BOS in a container (`compose.yaml`)
- **Obsidian**: browse `docs/` as a vault

Decide where the workshop lives: `~/__WORKSHOP` by default, or
`/media/<user>/<partition>/__WORKSHOP` on a mounted drive. To point BOS
anywhere else, set `BOS_WORKSHOP` or pass `--workshop=PATH`.

Next: [installation](installation.md)
