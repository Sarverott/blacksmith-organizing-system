import { BOS } from "../../main.ts";
import loading from "../loading/_index.mjs";
import { captureTtystory } from "./capture-ttystory.mjs";
import { recordClosing } from "./record-closing.mjs";

const own = new BOS.Procedure("closing")
  .step("capture ttystory", captureTtystory)
  .step("record closing", recordClosing);

export const closing = loading.chain(own, "closing");
export default closing;
