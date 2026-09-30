// Every view: how BOS presents itself. Each renders text for people or json for machines.
import HelpView from "./help/_index.mjs";
import InventoryView from "./inventory/_index.mjs";
import PromotionView from "./promotion/_index.mjs";
import { startRepl } from "./repl/_index.mjs";
import StatusView from "./status/_index.mjs";

export { paint } from "./terminal/paint.mjs";
export default { StatusView, HelpView, PromotionView, InventoryView, startRepl };
