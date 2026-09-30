// Every conventional commit moves the version; each station of the branch flow has a channel:
//   developement → x.y.z-dev.N   testing → x.y.z-beta.N   releasing → x.y.z-rc.N   master → x.y.z (latest)
// revision (code review) releases nothing. Run by .github/workflows/publish-npm-pkg.yml.
const canon = process.env.GITHUB_REF_NAME === "master";

export default {
  branches: [
    "master",
    { name: "releasing", prerelease: "rc", channel: "rc" },
    { name: "testing", prerelease: "beta", channel: "beta" },
    { name: "developement", prerelease: "dev", channel: "dev" },
  ],
  // biome-ignore lint/suspicious/noTemplateCurlyInString: semantic-release placeholder, filled by semantic-release
  tagFormat: "v${version}",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          { breaking: true, release: "major" },
          { type: "feat", release: "minor" },
          { type: "*", release: "patch" }, // docs, chore, ci, test… each still counts
        ],
      },
    ],
    ["@semantic-release/release-notes-generator", { preset: "conventionalcommits" }],
    // only canon keeps CHANGELOG.md and the version in package.json; prereleases live in tags
    ...(canon ? [["@semantic-release/changelog", { changelogFile: "CHANGELOG.md" }]] : []),
    "@semantic-release/npm",
    ...(canon ? ["./release/sync-plugin-version.mjs"] : []),
    ...(canon
      ? [
          [
            "@semantic-release/git",
            {
              assets: ["package.json", "package-lock.json", "CHANGELOG.md", ".claude-plugin/plugin.json"],
              // biome-ignore lint/suspicious/noTemplateCurlyInString: semantic-release placeholder, filled by semantic-release
              message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
            },
          ],
        ]
      : []),
    ["@semantic-release/github", { successComment: false, failComment: false }],
  ],
};
