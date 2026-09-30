// craftbook/scrapnotes: every note not yet promoted to a document (glossary: scrapnote).
import { BOS } from "../../main.ts";

export class Scrapnotes extends BOS.Submodule {
  static type = "scrapnotes";
  static ownerType = "craftbook";
  static dirname = "scrapnotes";
}

export default Scrapnotes;
