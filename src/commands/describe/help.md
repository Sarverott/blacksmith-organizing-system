# describe

`bos describe` prints a conventional-commit draft of what is staged.
`bos describe --hook <file> [source]` is what husky's `prepare-commit-msg`
calls: it writes the draft into the commit message file of a plain `git commit`.
