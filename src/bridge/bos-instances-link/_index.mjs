// Links between BOS instances of one setternet (glossary: setternet, host-role).
// [TODO] transport and protocol are not decided yet; this names the handler.
import { BOS } from "../../main.ts";

export class BosInstancesLink extends BOS.Bridge {
  static id = "bos-instances-link";

  async available() {
    return false;
  }

  // hosts known to this workshop, from .BOS/setup/setternet/ [TODO] format
  hosts() {
    return [];
  }
}

export default BosInstancesLink;
