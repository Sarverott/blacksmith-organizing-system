# BOS documentation

The site is built with [MkDocs](https://www.mkdocs.org) + Material from these
markdown files (config: `mkdocs.yml`, in this folder) and published on Read the Docs.
This directory is also an Obsidian vault (`.obsidian/`): `[[links]]` resolve in
Obsidian, and on the site too (`_mkdocs/wikilinks.py`).

Preview: `task docs:serve` · strict build: `task docs:build` · after changing
`pyproject.toml`: `task docs:lock` (refreshes the `requirements.txt` Read the Docs installs).
A new page also needs an entry in `nav:` in `mkdocs.yml`.

| Section | Contents |
| ------- | -------- |
| [glossary/](glossary/README.md) | one page per element of the environment: what it is, why it exists, where it lives |
| tutorials | [preinstall](tutorials/preinstall.md) → [installation](tutorials/installation.md) → [getting started](tutorials/GETTING_STARTED.md) → [first use](tutorials/first-use-example.md); [logicflows](tutorials/logicflow-explanation.md) |
| infographics | [branch movement procedures](infographics/branch-movement-procedures.md) |

Order of truth: glossary (meaning) → `src/models/` (structure) → `src/procedures/` (behaviour).
