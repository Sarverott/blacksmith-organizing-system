import { BOS } from "../../main.ts";
import bootstrapping from "../bootstrapping/_index.mjs";
import { recordOpening } from "./record-opening.mjs";

const own = new BOS.Procedure("opening").step("record opening", recordOpening);

export const opening = bootstrapping.chain(own, "opening");
export default opening;
