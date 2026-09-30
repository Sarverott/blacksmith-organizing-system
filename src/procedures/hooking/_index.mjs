import { BOS } from "../../main.ts";
import loading from "../loading/_index.mjs";
import locating from "../locating/_index.mjs";
import { installHooks } from "./install-hooks.mjs";
import { recordHook } from "./record-hook.mjs";

export const hooking = loading.chain(new BOS.Procedure("hooking").step("record hook", recordHook), "hooking");
export const installingHooks = locating.chain(new BOS.Procedure("installing-hooks").step("link hooks", installHooks), "installing-hooks");
export default hooking;
