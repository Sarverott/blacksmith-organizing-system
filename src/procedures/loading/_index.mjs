import { BOS } from "../../main.ts";
import locating from "../locating/_index.mjs";
import { loadConfig } from "./load-config.mjs";
import { validateRole } from "./validate-role.mjs";

const own = new BOS.Procedure("loading", [], { description: "load workshop.json over the defaults and validate it" })
  .step("load workshop config", loadConfig)
  .step("validate host role", validateRole);

export const loading = locating.chain(own, "loading");
export default loading;
