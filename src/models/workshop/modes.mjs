// Modes of work: what kind of need the workshop serves right now (glossary: mode).
// The digit is the key in the `bos mode` chooser; 0 leaves it.
export const MODES = {
  almanac: {
    digit: 1,
    title: "ALMANAC",
    covers: "emergency protocols: sinking",
  },
  conform: {
    digit: 2,
    title: "CONFORM",
    covers: "establishing the workshop, migrations, cleaning, verifying, syncing between fortified workshops",
  },
  smeltry: {
    digit: 3,
    title: "SMELTRY",
    covers: "code, development, active editing, publishing changes",
  },
  commandorate: {
    digit: 4,
    title: "COMMANDORATE",
    covers: "rulesets, privileges, roles, switching modes",
  },
  provision: {
    digit: 5,
    title: "PROVISION",
    covers: "presenting what a source of truth delivers, e.g. a repository on GitHub",
  },
};

export const modeByDigit = (digit) => Object.keys(MODES).find((name) => MODES[name].digit === Number(digit)) ?? null;
