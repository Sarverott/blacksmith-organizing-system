// A submodule is an organ of its owner: it exists only inside that owner and is
// built from it, never from a bare path. Its dirname is relative to the owner.
//   workshop.storylines        (declared as  static submodules = { storylines: Storylines })
import { BasicElement } from "./basic-element.mjs";

export class BasicSubmodule extends BasicElement {
  static ownerType = null; // the type of element this organ belongs to, e.g. "workshop"

  constructor(owner) {
    const { ownerType, dirname, name } = new.target;
    if (!owner || !(owner instanceof BasicElement))
      throw new Error(`${name} is a submodule: build it from its owner, not from a path`);
    if (ownerType && owner.type !== ownerType)
      throw new Error(`${name} hangs on a ${ownerType}, not on a ${owner.type}`);
    super(owner.file(dirname), owner);
  }

  get owner() {
    return this.parent;
  }
}
