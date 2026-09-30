// .BOS/storylines/logs (glossary: storylines)
import { BOS } from "../../main.ts";

export class Logs extends BOS.Submodule {
  static type = "logs";
  static ownerType = "storylines";
  static dirname = "logs";
}

export default Logs;
