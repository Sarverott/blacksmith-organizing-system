# Contributing

1. Read the [glossary](../docs/glossary/README.md): code follows meaning.
2. Branch from `developement` (here we code). Never commit to `master`.
3. Keep BOS behaviour as code: procedures in `src/procedures/<name>/` (DESCRIPTION.md + one file per step), with tests in `tests/`.
4. `task test` must pass. Test against temporary workshops only.
5. Open a pull request into `revision`. A maintainer (or someone they
   authorize) approves; self-approval only after automated checks, and a second
   pair of eyes is always healthier.
6. From there: `testing` (tests, nightly builds) → `releasing` (stamping,
   publishing, announcing) → `master` through a pull request.
   See [branch movement procedures](../docs/infographics/branch-movement-procedures.md).

Mark unknowns [`TODO`] and interpretations *(assumed)*; don't invent meanings.
