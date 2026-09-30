// .BOS: where BOS keeps itself inside a workshop (glossary: system).
import { BOS } from "../../main.ts";
import Data from "../data/class.mjs";
import Nests from "../nests/class.mjs";
import Setup from "../setup/class.mjs";
import Storylines from "../storylines/class.mjs";
import { workshopTaskfile } from "./taskfile.mjs";

export class System extends BOS.Model {
  static type = "system";
  static dirname = ".BOS";
  static children = [Setup, Data, Nests, Storylines];
  static descriptors = {
    "workshop.json": (element, context) => context.config ?? {},
    "Taskfile.yaml": workshopTaskfile,
  };
}

export default System;
