# mode

`bos mode <name|digit>` switches the mode of work of this workshop.
`bos mode` shows the menu and waits for one digit (no Enter needed); `0` leaves it.

| digit | mode | covers |
| ----- | ---- | ------ |
| 1 | ALMANAC | emergency protocols: sinking |
| 2 | CONFORM | establishing the workshop, migrations, cleaning, verifying, syncing between fortified workshops |
| 3 | SMELTRY | code, development, active editing, publishing changes |
| 4 | COMMANDORATE | rulesets, privileges, roles, switching modes |
| 5 | PROVISION | presenting what a source of truth delivers, e.g. a repository on GitHub |

The mode is kept in `.BOS/workshop.json`, and every switch is recorded in storylines.
