// What an agent learns at the start of a session: the workshop, its role and mode, where it
// works, the House's boundaries, and the tools BOS gives it. Short: it becomes context.
import House from "../../models/house/class.mjs";
import { MODES } from "../../models/workshop/modes.mjs";
import { situate } from "../../procedures/agent-recording/situate.mjs";

export async function brief(input) {
  const context = await situate(input);
  if (!context) return null;
  const { config, defaulted = [], self } = context;
  const mark = (key) => (defaulted.includes(key) ? " (default)" : "");
  const place = context.workshop.placeOf(input.cwd ?? process.cwd());
  const where = !place
    ? "outside this workshop"
    : place.area
      ? [place.area, place.scope, place.project].filter(Boolean).join(" / ")
      : "workshop root";
  const house = new House();
  const resting = [...house.children(), ...house.orders()]
    .filter((g) => g.state !== "active")
    .map((g) => g.title ?? g.name);
  return [
    "# BOS: Blacksmith Organization System",
    `workshop ${context.workshopRoot} · role ${config.role}${mark("role")} · mode ${MODES[config.mode]?.title ?? config.mode}${mark("mode")} · BOS v${self.version}`,
    `you are in: ${where}`,
    `House of Anubis: ${house.children().length} adopted children, orders: ${house
      .orders()
      .map((o) => o.title ?? o.name)
      .join(", ")}.${resting.length ? ` Resting, never call or prompt: ${resting.join(", ")}.` : ""}`,
    "tools: `bos <model> <tool>` on PATH (bos help), MCP tools <model>_<tool> (workshop_glossary explains any element)",
    "rules: ask the House before calling any ollama model · conventional commits · look before changing the owner's files · the owner works in parallel: re-check git state",
    "",
  ].join("\n");
}
