// Every commit message is a conventional commit: <type>(<scope>): <subject>
// semantic-release turns the type into the next version (release.config.mjs).
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-max-length": [2, "always", 100],
    "body-max-line-length": [0], // bodies list files, lines can be long
    "subject-case": [0], // subjects may start with a name, e.g. "update README"
  },
};
