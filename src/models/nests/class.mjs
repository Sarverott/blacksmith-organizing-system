// Volumes and disks of containers and VMs; always indexed and guarded (glossary: nestrelm).
import { BOS } from "../../main.ts";

export class Nests extends BOS.Model {
  static type = "nestrelm";
  static dirname = "nests";
  static descriptors = {
    ".index.json": () => ({ nests: {} }),
    ".manifest.json": () => ({ files: {} }),
  };
}

export default Nests;
