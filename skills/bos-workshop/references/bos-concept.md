# What BOS is

**Blacksmith Organization System (BOS)** by Sett Sarverott (2019–), MIT license.
Part of the R-tier superproject "ANUBIS". Main repository:
https://github.com/Sarverott/blacksmith-organization-system

The goal is to automate management of a personal "forest of projects": a method
for sorting project types, grouping the parts of a project and families of
related projects, and keeping them working, synchronized and archived across
several machines (workspaces), servers and publication targets.

Guiding rule from the author: *"if it is good thinking then it will be automated"*.
BOS itself is supposed to create and maintain the workshop tree. Until it does,
agents follow these rules by hand.

## Workshop tree

Canonical tree, taken from `config/workshop.json.default` on the repository's
`developement` branch. Each key is a directory and each value is the element
type it holds.

| Directory     | Type      | Notes |
| ------------- | --------- | ----- |
| `forge/`      | forge     | Center of the craftspace. Holds the Artefacts that are open right now: focused, in dev mode, flagged with the user's mid-sync signature. On save a commit is made, signing runs, and automation starts. |
| `archive/`    | archive   | Integrity base: non-releasable repos, buffering mirrors between the craftspace and the production VCS server. Holds **sarcophags**. |
| `craftbook/`  | craftbook | [`TODO`] (probably replaces the older `scrapbook`/`notes`: notes, notebooks, docs, text data that needs extra care) |
| `devarmory/`  | devtools  | [`TODO`] |
| `.SETUP/`     | config    | Configuration, workshop history, dev data (older name: `setup/`) |
| `.DATA/`      | data      | Data files, e.g. `*.gitlist` lists of repos to mirror into `archive/` |
| `.__BOS/`     | system    | The BOS installation itself [`TODO`] confirm |
| `.NESTRELM/`  | sandbox   | [`TODO`] |
| `.STORYLINES/`| history   | [`TODO`] |
| `.VIEWS/`     | display   | [`TODO`] |

The four visible areas (forge, archive, devarmory, craftbook) must always exist.
If any is missing, create it. [`TODO`] Decide whether the hidden areas are also
mandatory.

Workshop config lookup order (`config` in `workshop.json.default`):
`<workshop>/.workshop.json`, `~/.workshop.json`, `~/.config/bos/workshop.json`,
`~/.vscode/extensions/bos/workshop.json`.

> Naming conflict: the repository defaults to the hidden `~/.__WORKSHOP`, but
> the current standard is the visible `~/__WORKSHOP`. Prefer `~/__WORKSHOP`.

## Element (Artefact) types — the "models"

| Type | Meaning |
| ---- | ------- |
| **workshop** | Root of the whole tree |
| **forge** / **archive** / **craftbook** | Top-level areas (see table above) |
| **scope** | Formerly *superproject*. A recurring Artefact with its own collection of Artefacts, each one a git submodule: a family of related parts with shared automation, configs, secrets and publication setup. Example: `forge/blacksmith-organization-system/` |
| **project** | A concrete, independent project with a name and a focused workflow |
| **sheme** (sic) | Schematic-type material: graphics/audio/data source files, notes, notebooks, playgrounds, live-code docs, VM/container sandboxes, test areas |
| **throwbox** | Every collection has one: the default place for loose files. When the collection closes, BOS sweeps the throwbox, auto-describes and packs it into an unlabeled sarcophag for later sorting |
| **sarcophag** | A single encrypted container that holds one bare repo (lives in archive) |
| **exhibit** | Based on sarcophags; a publication view of canon [`TODO`] |
| **collection** | Collection of Artefacts (a container) |
| **craftset** | [`TODO`] (repos also have `.craftset/` and `.craftsets/` directories holding tooling setups) |
| **postroad** | [`TODO`] |
| **scrapnote** | [`TODO`] (older name: scrapbook) |

## Branch flow of BOS repositories (from docs/README.md)

`developement` (addons sink) → `testing` (awaiting approval) → `master`
(release candidate) → `canonical` (confirmed by the **Canon Keeper**). Also
`gh-pages`, `releasing`, `including`, `revision`.

Versioning is `{G}.{R}.{I}.{H}`: Generation, Reconstruction, Integration, Hooking.

## Related repositories

- Apps: bos-desktop, bos-mobile, bos-server, bos-gui, bos-vscode-extension (`apps/templates.csv`)
- Components: `Sarverott/bos.<component>` (see bos-codebase.md)
- Library: carnival-toolbox (npm)
- This skillset: `forge/blacksmith-organization-system/bos-skillset`
