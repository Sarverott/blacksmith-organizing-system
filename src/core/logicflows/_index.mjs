// Every logicflow BOS knows, by the name used on the command line.
import { bootstrap } from "./bootstrap.mjs";
import { closeWorkshop } from "./close-workshop.mjs";
import { envRead } from "./env-read.mjs";
import { handleHook, installHooks } from "./hook-handlers.mjs";
import { openWorkshop } from "./open-workshop.mjs";
import { promote } from "./ci-cd.mjs";
import { setupLoad } from "./setup-load.mjs";
import { BasicProcedure } from "../basic-procedure.mjs";

// read-only: what the workshop looks like, creating nothing
const inspecting = new BasicProcedure("inspecting").step("inspect tree", (context) => {
  context.tree = context.workshop.inspect();
});

export const LOGICFLOWS = {
  locate: envRead,
  status: envRead.chain(setupLoad).chain(inspecting, "status"),
  bootstrap: envRead.chain(setupLoad).chain(bootstrap, "bootstrap"),
  open: openWorkshop,
  close: closeWorkshop,
  hook: handleHook,
  "hooks-install": installHooks,
  promote,
};

export { bootstrap, closeWorkshop, envRead, handleHook, installHooks, openWorkshop, promote, setupLoad };
