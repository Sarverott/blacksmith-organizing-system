// work at rest: sarcophags, exhibits, mirrors (glossary: archive)
import { BOS } from "../../main.ts";

export class Archive extends BOS.Model {
  static type = "archive";
  static dirname = "archive";
}

export default Archive;
