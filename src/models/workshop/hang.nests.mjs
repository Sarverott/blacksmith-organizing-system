// .BOS/nests: volumes and disks of containers and VMs, always indexed and guarded (glossary: nestrelm).
import { BOS } from "../../main.ts";

export class Nests extends BOS.Submodule {
  static type = "nestrelm";
  static ownerType = "workshop";
  static dirname = ".BOS/nests";
  static descriptors = {
    ".index.json": () => ({ nests: {} }),
    ".manifest.json": () => ({ files: {} }),
  };
}

export default Nests;
