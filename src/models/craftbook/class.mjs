// Knowledge: scrapnotes, craftsets, collections, recipes (glossary: craftbook).
import { BOS } from "../../main.ts";

class Scrapnotes extends BOS.Model {
  static type = "scrapnotes";
  static dirname = "scrapnotes";
}

export class Craftbook extends BOS.Model {
  static type = "craftbook";
  static dirname = "craftbook";
  static children = [Scrapnotes];
}

export default Craftbook;
