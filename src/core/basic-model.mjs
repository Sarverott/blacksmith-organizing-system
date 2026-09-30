// A model is an asset of the workshop that stands on its own: built from any path.
//   new Project("/home/smith/__WORKSHOP/forge/scope/project")
import { BasicElement } from "./basic-element.mjs";

export class BasicModel extends BasicElement {}

export { createIfMissing, sha256, walkFiles } from "./basic-element.mjs";
