# Describing Protocol

Part of SMELTRY. A commit should describe its own content. This protocol reads
the staged changes and drafts a conventional-commit message:

- **type**: `docs`, `test`, `ci` or `build` when only that part changed; `feat`
  when new source files appear; otherwise `chore`
- **scope**: the part of the project (`procedures`, `bridge`, `models`, `docs`, …),
  from `scopes.mjs`
- **subject**: add / update / remove, plus what the paths are about
- **body**: every file, marked A / M / D

Then **Skryba**, the scribe raven (`resources/ravens/skryba.md`), reads the
trimmed staged diff through ollama and proposes a better subject and a short
body. He answers in a fixed JSON shape, so the header is always a valid
conventional commit, and the file list stays. When ollama or the model is
missing, or the answer is unusable, the plain draft is used.
`BOS_SKRYBA=0` turns him off; `BOS_SKRYBA_MODEL` picks another model.

Husky's `prepare-commit-msg` runs it (`bos project prepare-message`), so a plain
`git commit` opens the editor with the draft. A message given with `-m`, a
merge, a squash or an amend is never touched. commitlint then checks the
format, and semantic-release turns the type into the next version.
