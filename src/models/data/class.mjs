// data BOS works from, e.g. <pack>.gitlist (glossary: data)
import { BOS } from "../../main.ts";

export class Data extends BOS.Model {
  static type = "data";
  static dirname = "data";
}

export default Data;
