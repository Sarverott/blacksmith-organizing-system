// The workshop: root of crafting on a host or partition (glossary: workshop).
// Areas are models (they hold assets); .BOS internals are submodules hanging on it.
import { BOS } from "../../main.ts";
import Archive from "../archive/class.mjs";
import Craftbook from "../craftbook/class.mjs";
import Devarmory from "../devarmory/class.mjs";
import Forge from "../forge/class.mjs";
import Data from "./hang.data.mjs";
import Nests from "./hang.nests.mjs";
import Setup from "./hang.setup.mjs";
import Storylines from "./hang.storylines.mjs";
import System from "./hang.system.mjs";
import { placeOf, WORKSHOP_DIRNAME } from "./locate.mjs";
import { toolkit } from "./toolkit.mjs";

export class Workshop extends BOS.Model {
  static type = "workshop";
  static dirname = WORKSHOP_DIRNAME;
  static submodules = { system: System, setup: Setup, data: Data, nests: Nests, storylines: Storylines };
  static children = [Devarmory, Forge, Craftbook, Archive];
  static toolkit = toolkit;

  get forge() {
    return new Forge(this.file(Forge.dirname), this);
  }

  placeOf(path) {
    return placeOf(path, this.path);
  }
}

export default Workshop;
