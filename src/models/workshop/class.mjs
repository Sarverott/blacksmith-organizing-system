// The workshop: root of crafting on a host or partition (glossary: workshop).
import { BOS } from "../../main.ts";
import Archive from "../archive/class.mjs";
import Craftbook from "../craftbook/class.mjs";
import Devarmory from "../devarmory/class.mjs";
import Forge from "../forge/class.mjs";
import Storylines from "../storylines/class.mjs";
import System from "../system/class.mjs";
import { WORKSHOP_DIRNAME, placeOf } from "./locate.mjs";

export class Workshop extends BOS.Model {
  static type = "workshop";
  static dirname = WORKSHOP_DIRNAME;
  static children = [System, Devarmory, Forge, Craftbook, Archive];

  get system() { return new System(this.file(System.dirname), this); }
  get forge() { return new Forge(this.file(Forge.dirname), this); }
  get storylines() { return new Storylines(this.file(System.dirname, Storylines.dirname), this.system); }

  placeOf(path) { return placeOf(path, this.path); }
}

export default Workshop;
