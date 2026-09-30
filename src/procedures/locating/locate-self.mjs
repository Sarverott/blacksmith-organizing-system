import { CLI, REPO_ROOT, VERSION } from "../../core/self.mjs";
import { placeOf } from "../../models/workshop/locate.mjs";

// BOS is a project like any other: where does it sit in the workshop?
export const locateSelf = (context) => {
  context.self = { root: REPO_ROOT, cli: CLI, version: VERSION, place: placeOf(REPO_ROOT, context.workshopRoot) };
};
