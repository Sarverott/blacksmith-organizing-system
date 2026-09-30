// Knowledge: scrapnotes, craftsets, collections, recipes (glossary: craftbook).
import { BOS } from "../../main.ts";
import Scrapnotes from "./hang.scrapnotes.mjs";

export class Craftbook extends BOS.Model {
  static type = "craftbook";
  static dirname = "craftbook";
  static submodules = { scrapnotes: Scrapnotes };
}

export default Craftbook;
