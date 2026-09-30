# Mode Switching Protocol

Part of COMMANDORATE. Sets the mode of work of this workshop in
`.BOS/workshop.json` (`"mode"`) and records the switch in storylines
(`{"event":"mode","from":…,"to":…}`). Accepts a name or its digit:
1 almanac, 2 conform, 3 smeltry, 4 commandorate, 5 provision.
The workshop is bootstrapped first, so `.BOS/` exists to hold the choice.
