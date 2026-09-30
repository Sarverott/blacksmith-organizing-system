# Describing Protocol

Part of SMELTRY. A commit should describe its own content. This protocol reads
the staged changes and drafts a conventional-commit message:

- **type**: `docs`, `test`, `ci` or `build` when only that part changed; `feat`
  when new source files appear; otherwise `chore`
- **scope**: the part of the project (`procedures`, `bridge`, `models`, `docs`, …),
  from `scopes.mjs`
- **subject**: add / update / remove, plus what the paths are about
- **body**: every file, marked A / M / D

Husky's `prepare-commit-msg` runs it (`bos describe --hook`), so a plain
`git commit` opens the editor with the draft. A message given with `-m`, a
merge, a squash or an amend is never touched. commitlint then checks the
format, and semantic-release turns the type into the next version.
