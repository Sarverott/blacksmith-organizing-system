import { MODES } from "../../models/workshop/modes.mjs";

export const validateMode = (context) => {
  const { mode } = context.config;
  if (mode && !(mode in MODES)) {
    throw new Error(`unknown mode "${mode}" in workshop.json (known: ${Object.keys(MODES).join(", ")})`);
  }
};
