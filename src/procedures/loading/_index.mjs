import { BOS } from "../../main.ts";
import locating from "../locating/_index.mjs";
import { loadConfig } from "./load-config.mjs";
import { validateMode } from "./validate-mode.mjs";
import { validateRole } from "./validate-role.mjs";

const own = new BOS.Procedure("loading", [], { description: "load workshop.json over the defaults and validate role and mode" })
  .step("load workshop config", loadConfig)
  .step("validate host role", validateRole)
  .step("validate mode", validateMode);

export const loading = locating.chain(own, "loading");
export default loading;
