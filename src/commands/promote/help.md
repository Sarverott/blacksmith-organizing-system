# promote

`bos promote [--reject] [--apply]` moves the current branch one station:
`master → developement → revision → testing → releasing → master`.
`--reject` sends work back to `developement`. Without `--apply` it only shows
the plan. `releasing → master` opens a GitHub pull request (needs `$GITHUB_TOKEN`).
