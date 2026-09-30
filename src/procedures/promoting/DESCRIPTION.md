# Promoting Protocol

Moves the current branch one station along the flow
(`docs/infographics/branch-movement-procedures.md`):
master → developement → revision → testing → releasing → master.
With `--reject`, sends work back to developement. It is a dry run unless
applied. Merges are made locally with isomorphic-git (a merge commit, like
`--no-ff`). releasing → master opens a GitHub pull request instead.
