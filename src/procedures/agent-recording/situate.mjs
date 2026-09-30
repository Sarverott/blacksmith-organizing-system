// Where an agent session happens: locate and load the workshop from the hook's cwd.
// Returns null when there is no workshop there; hooks never create one.
import { existsSync } from "node:fs";

import loading from "../loading/_index.mjs";

export async function situate(input) {
  if (input.cwd && existsSync(input.cwd)) process.chdir(input.cwd);
  const context = await loading.run({ options: { workshop: process.env.BOS_WORKSHOP } });
  return context.workshop.exists() ? context : null;
}
