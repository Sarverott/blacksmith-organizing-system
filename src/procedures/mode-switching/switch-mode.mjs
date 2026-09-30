import { MODES, modeByDigit } from "../../models/workshop/modes.mjs";

// accepts a name (smeltry) or its digit (3)
export const switchMode = (context) => {
  const asked = String(context.options.mode ?? "").toLowerCase();
  const mode = asked in MODES ? asked : modeByDigit(asked);
  if (!mode) throw new Error(`unknown mode "${asked}" (known: ${Object.entries(MODES).map(([name, m]) => `${m.digit} ${name}`).join(", ")})`);
  context.previousMode = context.config.mode ?? null;
  context.config = context.workshop.system.update({ mode }, context);
  context.config.mode = mode;
};
