// An agent's work leaves storylines like a person's: its sessions as events, its shell
// commands as its own ttystory (ttystory-<host>-claude-<session>.txt, one line per command:
// unixusat, cwd, command). Storylines hold shell history: treat them like .BOS/setup.
import { appendFileSync } from "node:fs";

import { situate } from "./situate.mjs";

export async function recordAgentEvent(input, event) {
  const context = await situate(input);
  if (!context) return null;
  const storylines = context.workshop.storylines.ensure(context);
  return storylines.record(
    {
      event,
      agent: "claude",
      session: input.session_id ?? null,
      source: input.source ?? null,
      model: input.model ?? null,
      place: context.workshop.placeOf(input.cwd ?? process.cwd()),
    },
    context,
  );
}

export async function recordAgentCommand(input) {
  const command = input.tool_input?.command;
  if (!command) return null;
  const context = await situate(input);
  if (!context) return null;
  const storylines = context.workshop.storylines.ensure(context);
  const file = storylines.ttystories.file(`ttystory-${context.env.host}-claude-${input.session_id ?? "unknown"}.txt`);
  appendFileSync(file, `${Date.now()}\t${input.cwd ?? process.cwd()}\t${command.replace(/\n/g, "\\n")}\n`);
  return file;
}
