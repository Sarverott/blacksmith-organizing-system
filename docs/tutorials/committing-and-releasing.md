# Committing and releasing

Every commit describes itself, every commit moves the version, and every
version is published by the pipeline. Nobody has to count versions.

## Committing

`npm install` activates [husky](https://typicode.github.io/husky/). Its hooks in
`.husky/` hand git events to BOS:

| Hook | What happens |
| ---- | ------------ |
| `pre-commit` | [Biome](https://biomejs.dev) lints and formats the staged files (fixes go into the commit), then the tests run (`vitest`) |
| `prepare-commit-msg` | `bos project prepare-message` drafts the message from the staged changes |
| `commit-msg` | `commitlint` checks that the message is a conventional commit |
| `post-commit`, `post-checkout`, `post-merge` | `bos hook` records the event in the workshop's storylines |

A plain `git commit` opens the editor with a draft such as:

```
feat(procedures): add describing

A src/procedures/describing/_index.mjs
A src/procedures/describing/scopes.mjs
```

When ollama runs on the machine, **Skryba**, the scribe raven
([raven](../glossary/raven.md)), refines that draft: he reads the trimmed staged
diff and proposes a subject about the *purpose* of the change, plus a short
body. The file list stays, and a `Drafted-by: Skryba (<model> via ollama)`
trailer shows who wrote it:

```
feat: make AI helpers of the workshop possible

This commit adds the foundation for AI helpers of the workshop, including the
OllamaLink bridge and the ravens loader. It also introduces the Skryba raven.

A resources/ravens/skryba.md
A src/bridge/ollama-link/_index.mjs

Drafted-by: Skryba (tulu3 via ollama)
```

He only proposes. You edit or accept it in the editor, and nothing is
committed or pushed without you. Without ollama, or with an unusable answer,
the plain draft appears. `BOS_SKRYBA=0 git commit` skips him;
`BOS_SKRYBA_MODEL=llama3.1:8b` picks another model. The first commit of a
session waits for the model to load (up to ~90 s); it then stays warm for 30
minutes, and later drafts take ~10 s.

Change the type, scope or subject if the draft guessed wrong. A message given
with `-m` is never touched, but commitlint still checks it. See
`bos project describe` (or `task describe`) for the draft without committing.

### Guided commits: commitizen

`npm run commit` (or `task commit`) asks for type, scope, subject, body and
breaking changes step by step ([commitizen](https://commitizen.github.io/cz-cli/)
with the commitlint rules, so the prompts and the checks never disagree).
It passes the message with `-m`, so Skryba stays quiet and commitlint still checks it.

Types: `feat` (new behaviour), `fix`, `docs`, `test`, `refactor`, `perf`,
`build`, `ci`, `chore`, `style`. A `!` after the type (`refactor(core)!: …`)
or a `BREAKING CHANGE:` line marks a breaking change.

## Versions

semantic-release reads the commits since the last version tag
(`release.config.mjs`):

| In the commits | Next version |
| -------------- | ------------ |
| a breaking change | major |
| a `feat` | minor |
| anything else | patch |

Each station of the [branch flow](../infographics/branch-movement-procedures.md)
has its own channel:

| Branch | Version | npm dist-tag |
| ------ | ------- | ------------ |
| `developement` | `0.8.0-dev.N` | `dev` |
| `revision` | none (code review) | |
| `testing` | `0.8.0-beta.N` | `beta` |
| `releasing` | `0.8.0-rc.N` | `rc` |
| `master` | `0.8.0` | `latest` |

The baseline is the tag **`v0.7.0`**. The old line reached 0.6.1 in its
source and 0.4.2 on npm under the same package name. Only `master` writes
the version into `package.json` and `CHANGELOG.md`; prereleases live in tags.
`bos --version` and `bos workshop status` show the version of the installation.

## Releasing

On every push to `developement`, `testing`, `releasing` or `master`, the
**Release** workflow (`.github/workflows/publish-npm-pkg.yml`):

1. runs the tests (`nodejs-ci.yml`, with `HUSKY=0`: hooks are for workstations)
2. runs semantic-release: tag, GitHub release, npm package with provenance
3. publishes the same version to GitHub Packages as `@sarverott/blacksmith-organization-system` (`publish-github-node-pkg.yml`)
4. builds and pushes `ghcr.io/sarverott/blacksmith-organization-system:<version>` and `:<channel>` (`publish-docker-container.yml`)

Steps 3 and 4 can also be run by hand for an existing tag (workflow dispatch).

Repository settings it needs: an `NPM_TOKEN` secret (an npm automation token
for `blacksmith-organization-system`), and Actions allowed to create tags,
releases and packages.
