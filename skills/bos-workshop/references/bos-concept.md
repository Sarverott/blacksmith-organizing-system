# What BOS is

**Blacksmith Organization System (BOS)** by Sett Sarverott (2019–), MIT license.
Part of the R-tier superproject "ANUBIS". Repositories:

- old core: https://github.com/Sarverott/blacksmith-organization-system (local: `forge/blacksmith-organization-system/blacksmith-organization-system`)
- root of the new BOS (this skillset): https://github.com/Sarverott/blacksmith-organizing-system (local: `forge/blacksmith-organization-system/bos-skillset`)

The goal is to automate the management of a personal "forest of projects"
across many machines, servers and publication targets, without version drift
("variantogeddon"). The author's rule: *"if it is good thinking then it will be
automated"*.

**Authoritative definitions:** `docs/glossary/<element>.md` in this repository
(bos-skillset), one page per element, index in `docs/glossary/README.md`.
Expressed as code in `src/models/class.mjs`. The old core repo holds an older copy. This file is a
summary; if the two disagree, the glossary wins. The author annotates the
glossary directly: read their changes (`git diff`) before summarizing.

## The skeleton: three layers

### 1. Network

- **Setternet (snet):** the owner's network of BOS hosts. Setup lives in `.BOS/setup/setternet/`.
- **Host roles** (PL originals): master's outpost (Posterunek Mistrza: remote
  management), forging point (Punkt Kuźniczy: development), trial hall (Sala
  Prób: VMs, testing), market stall (Kram Targowy: publication only), canon
  monolith (Monolit Kanonu: the master archive; exactly one per setternet),
  side catacomb (Katakumb Poboczny: single-purpose archive, e.g. Ollama or deployments).
- **Canon:** the complete, authoritative record, held by the canon monolith, and
  in git by the `canonical` branch, which the Canon Keeper confirms.

### 2. Workshop: one per host or partition

```
__WORKSHOP/
├── .BOS/          internal, mandatory: workshop.json Taskfile.yaml .omnis.toml package.json Dockerfile compose.yaml
│   ├── setup/     keys, VPN, routing, DNS/SSH aliases, tokens, setternet/   (mandatory)
│   ├── data/      e.g. <pack>.gitlist
│   ├── nests/     container/VM volumes; always .index.json + .manifest.json (mandatory)
│   └── storylines/ ttystories/ logs/ manifests/ metadata.json            (created during use)
├── devarmory/     tools: manifest-listed, auto-downloaded, checksum-verified, linked to PATH/desktop
├── forge/         active work (the desk): <scope>/<project|sheme>, throwbox; defines the working branch
├── craftbook/     knowledge: scrapnotes/, craftsets, collections, recipes
└── archive/       at rest: sarcophags, exhibits, <pack>/<mirror>
```

The four crafting areas and `.BOS/` must always exist; BOS creates them at
boot. Older layouts had `.SETUP`, `.DATA`, `.NESTRELM`, `.STORYLINES` and
`.__BOS` as separate top-level dirs, `~/.__WORKSHOP` as the root, and `notes/`
or scrapbook instead of craftbook.

Views (dashboards over CLI, web, mobile, Chrome extension, Electron, OpenAPI,
MCP, with one shared handler class) has no settled location yet.

### 3. Elements

- **scope** (formerly superproject): a private repository with submodules,
  holding a family of projects and shemes plus a throwbox. Synced through a
  self-hosted server (e.g. Gitea) that also keeps pre-public drafts.
- **project:** one concrete project repository.
- **sheme:** source material that isn't code: graphics/GIMP, Blender/CAD, photos,
  templates, third-party reference docs. A design template is a sheme; the code
  realizing it is a project. (The old scrapnote used sheme for processing
  routes: HF uploaders, publish and deploy routines. Unresolved.)
- **throwbox:** automated collector of loose files per scope; swept on close into an anonymous sarcophag.
- **sarcophag:** encrypted container holding one bare repository (archive).
- **exhibit:** view built from sarcophags (archive). [`TODO`]
- **scrapnote:** any note not yet promoted to a document; changelogs and release notes stay scrapnotes.
- **craftset:** reusable kit of notes, notebooks, one-off scripts and session
  setup; mandatory `.omnis.toml`, `metadata.json`, `manifest.json`, `Taskfile.yaml`.
- **collection**, **postroad:** meaning unresolved.

**Element anatomy** (pattern awaiting confirmation): a directory plus descriptor
files: `metadata.json` (identity/origin), `manifest.json` (checksums/integrity),
`.index.json` (map), `Taskfile.yaml` (procedures), `.omnis.toml` ([`TODO`]).

## Lifecycles

- work: forge → archive (sarcophag) → canon monolith
- loose files: throwbox → anonymous sarcophag → sorted, reused or deleted
- notes: scrapnote → document (or stays a scrapnote)
- tools: manifest → download → verify checksum → link

## Storylines naming

`ttystory.txt`, `ttystory-$UNIXUSAT.txt`, `ttystory-$HOSTNAME-$UNIXUSAT.txt`.
`UNIXUSAT` = Unix timestamp in milliseconds. The purpose is to reuse command
patterns and to teach AI to use the shell the BOS way.

## Ideas on record

Autocommit on save; GIMP history bound to VCS (a branch per session, a commit
per action); releases trigger social media posts; Taskfile + Husky + a standard
command set; history proven via OpenTimestamps.

## Branches and versioning

Every repository (docs/infographics/branch-movement-procedures.md): `master`
(spine of canon) → `developement` (here we code) → `revision` (approval) →
`testing` (QA, nightly builds) → `releasing` (stamp, publish, announce) →
`master` via pull request. Rejections go back to `developement`.
The old core repo additionally has `drafting`, `moderation`, `publishing` and
`dev/<topic>`; their place in the flow: [`TODO`]

Versioning is `{G}.{R}.{I}.{H}`: Generation, Reconstruction, Integration, Hooking.

## Related repositories

Apps: bos-desktop, bos-mobile, bos-server, bos-gui, bos-vscode-extension.
Components: `Sarverott/bos.<component>`. Library: carnival-toolbox.
