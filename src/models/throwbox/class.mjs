// Collector of loose files of one scope; swept on close (glossary: throwbox).
import { BOS } from "../../main.ts";

export class Throwbox extends BOS.Model {
  static type = "throwbox";
  static dirname = "throwbox";
}

export default Throwbox;
