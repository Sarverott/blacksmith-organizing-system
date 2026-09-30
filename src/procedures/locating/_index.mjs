import { BOS } from "../../main.ts";
import { locateSelf } from "./locate-self.mjs";
import { locateWorkshop } from "./locate-workshop.mjs";
import { readEnvironment } from "./read-environment.mjs";

export const locating = new BOS.Procedure("locating", [], { description: "read the machine, find the active workshop and BOS itself" })
  .step("read environment", readEnvironment)
  .step("locate workshop", locateWorkshop)
  .step("locate self", locateSelf);

export default locating;
