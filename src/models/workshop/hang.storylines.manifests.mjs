// .BOS/storylines/manifests (glossary: storylines)
import { BOS } from "../../main.ts";

export class Manifests extends BOS.Submodule {
  static type = "manifests";
  static ownerType = "storylines";
  static dirname = "manifests";
}

export default Manifests;
