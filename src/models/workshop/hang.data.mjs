// .BOS/data: data BOS works from, e.g. <pack>.gitlist (glossary: data)
import { BOS } from "../../main.ts";

export class Data extends BOS.Submodule {
  static type = "data";
  static ownerType = "workshop";
  static dirname = ".BOS/data";
}

export default Data;
