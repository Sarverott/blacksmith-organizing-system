// docs/infographics/branch-movement-procedures.md as data:
// master → developement → revision → testing → releasing → master (pull request);
// a rejection at revision, testing or releasing goes back to developement.
export const CANON = "master";

export const BRANCHES = {
  master: "spine of canon: stable state shared with production",
  developement: "further changing: here we code",
  revision: "control of code: approval by a maintainer",
  testing: "quality assurance: tests, nightly builds",
  releasing: "stamping, publishing and announcing",
};

export const PROMOTION = {
  master: "developement",
  developement: "revision",
  revision: "testing",
  testing: "releasing",
  releasing: CANON,
};
export const REJECTION = { revision: "developement", testing: "developement", releasing: "developement" };

export const needsPullRequest = (from, to) => from === "releasing" && to === CANON;
