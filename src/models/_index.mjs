// Models: assets of the working environment that stand on their own, one directory each.
// Submodules: organs that exist only inside their owner (models/<owner>/hang.<name>.mjs).
import Archive from "./archive/class.mjs";
import Craftbook from "./craftbook/class.mjs";
import Scrapnotes from "./craftbook/hang.scrapnotes.mjs";
import Craftset from "./craftset/class.mjs";
import Devarmory from "./devarmory/class.mjs";
import Exhibit from "./exhibit/class.mjs";
import Forge from "./forge/class.mjs";
import Project from "./project/class.mjs";
import Sarcophag from "./sarcophag/class.mjs";
import Scope from "./scope/class.mjs";
import Sheme from "./sheme/class.mjs";
import Throwbox from "./throwbox/class.mjs";
import Workshop from "./workshop/class.mjs";
import Data from "./workshop/hang.data.mjs";
import Nests from "./workshop/hang.nests.mjs";
import Setup from "./workshop/hang.setup.mjs";
import Storylines from "./workshop/hang.storylines.mjs";
import System from "./workshop/hang.system.mjs";

export { HOST_ROLES } from "./workshop/host-roles.mjs";
export * from "./workshop/locate.mjs";
export { MODES, modeByDigit } from "./workshop/modes.mjs";

export const submodules = { System, Setup, Data, Nests, Storylines, Scrapnotes };

export default {
  Workshop,
  Devarmory,
  Forge,
  Craftbook,
  Archive,
  Scope,
  Project,
  Sheme,
  Throwbox,
  Sarcophag,
  Exhibit,
  Craftset,
};
