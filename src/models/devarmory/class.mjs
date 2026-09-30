// Tools, listed with checksums so missing or damaged ones can be found (glossary: devarmory).
import { BOS } from "../../main.ts";

export class Devarmory extends BOS.Model {
  static type = "devarmory";
  static dirname = "devarmory";
  static descriptors = { "manifest.json": () => ({ tools: {}, files: {} }) }; // format still open
}

export default Devarmory;
