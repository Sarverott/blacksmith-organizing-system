// .BOS/setup: access and connectivity: keys, VPN, routing, aliases, tokens, setternet (glossary: setup)
import { BOS } from "../../main.ts";

export class Setup extends BOS.Submodule {
  static type = "setup";
  static ownerType = "workshop";
  static dirname = ".BOS/setup";
}

export default Setup;
