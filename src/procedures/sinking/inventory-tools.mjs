import { existsSync, readdirSync } from "node:fs";

// ttystories show which tools and programs the workstation really used
export const inventoryTools = (context) => {
  const dir = context.workshop.storylines.file("ttystories");
  context.inventory.ttystories = existsSync(dir) ? readdirSync(dir) : [];
};
