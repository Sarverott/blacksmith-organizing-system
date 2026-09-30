import { join } from "node:path";

import { REPO_ROOT } from "../../core/self.mjs";
import models from "../../models/_index.mjs";
import { readPage } from "./glossary.mjs";

// every standalone model, with its glossary page; submodules get no skill of their own
export const collectModels = (context) => {
  context.root = context.options.root ?? REPO_ROOT;
  context.models = Object.values(models).map((Model) => ({
    Model,
    type: Model.type,
    page: readPage(join(context.root, "docs", "glossary", `${Model.type}.md`)),
  }));
};
