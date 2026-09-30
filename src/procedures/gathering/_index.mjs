import { BOS } from "../../main.ts";
import { listServed } from "./list-served.mjs";
import { mergeResidents } from "./merge-residents.mjs";
import { readRegistry } from "./read-registry.mjs";

export const gathering = new BOS.Procedure("gathering", [], {
  description: "the House of Anubis: registry merged with what ollama serves",
})
  .step("read the House registry", readRegistry)
  .step("list served models", listServed)
  .step("merge residents", mergeResidents);

export default gathering;
