import { BOS } from "../../main.ts";
import bootstrapping from "../bootstrapping/_index.mjs";
import { recordMode } from "./record-mode.mjs";
import { switchMode } from "./switch-mode.mjs";

const own = new BOS.Procedure("mode-switching").step("switch mode", switchMode).step("record mode", recordMode);

// the workshop must be whole before it can change its mode
export const modeSwitching = bootstrapping.chain(own, "mode-switching");
export default modeSwitching;
