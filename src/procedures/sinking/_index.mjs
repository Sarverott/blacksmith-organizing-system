import { BOS } from "../../main.ts";
import loading from "../loading/_index.mjs";
import { inventoryForge } from "./inventory-forge.mjs";
import { inventoryTools } from "./inventory-tools.mjs";

// first, read-only part of sinking: know what has to be rescued
const own = new BOS.Procedure("sinking")
  .step("inventory forge", inventoryForge)
  .step("inventory tools", inventoryTools);

export const sinking = loading.chain(own, "sinking");
export default sinking;
