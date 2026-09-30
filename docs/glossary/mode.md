# Mode

> DRAFT

## What it is

The kind of need a workshop serves right now. Its role (host role) says what a
host *is* in the setternet; its mode says what the work *is* at this moment.

| Digit | Mode | Covers |
| ----- | ---- | ------ |
| 1 | **ALMANAC** | emergency protocols: [sinking](https://github.com/Sarverott/blacksmith-organization-system/blob/developement/src/procedures/sinking/DESCRIPTION.md) |
| 2 | **CONFORM** | establishing the workshop, migrations, cleaning, verifying, syncing between fortified workshops |
| 3 | **SMELTRY** | code, development, active editing, publishing changes |
| 4 | **COMMANDORATE** | rulesets, rule editing, granting and revoking privileges, assigning roles, switching modes |
| 5 | **PROVISION** | displaying or presenting what a source of truth delivers, e.g. a repository on GitHub |

## Why it exists

The same workshop is used in very different situations: rescuing work from a
compromised machine, keeping workshops in shape, forging code, governing
rules, presenting results. Naming them lets BOS sort its approaches by need
and, later, give each mode its own mechanics of models.

## Where

`.BOS/workshop.json` → `"mode"`. A first-time workshop starts in **CONFORM**
(`resources/workshop.default.json`): installing and configuring come first.
`null` or a missing value means "not set", and the default applies. Every switch is recorded in storylines
(`{"event":"mode","from":…,"to":…}`).

`bos mode` shows the menu and takes one digit (0 leaves); `bos mode <name|digit>`
switches directly. Switching modes is itself a COMMANDORATE act.

## Relations

Each command declares the mode it serves (`"mode"` in its `index.json`), and
`bos help` groups commands by mode:

- ALMANAC: `sink`
- CONFORM: `bootstrap`, `open`, `close`, `seal`, `verify`
- SMELTRY: `promote`, `hooks`, `hook`, `skills`
- COMMANDORATE: `mode`
- PROVISION: `house`
- general (any mode): `help`, `locate`, `status`, `repl`

## Open questions

- Does the mode restrict what may run, or only guide it? [`TODO`]
- Mechanics of models per mode [`TODO`]: next step
- Is the mode per workshop, per host, or per user session? [`TODO`] (now: per workshop)
