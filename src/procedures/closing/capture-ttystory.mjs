import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { createIfMissing } from "../../core/basic-element.mjs";

// bash writes history on exit: run `history -a` first to include the current shell
export const captureTtystory = (context) => {
  const storylines = context.workshop.storylines.ensure(context);
  const history = process.env.HISTFILE || join(context.env.home, ".bash_history");
  if (!existsSync(history)) return;
  const target = storylines.ttystories.file(storylines.ttystoryName(context));
  createIfMissing(target, () => copyFileSync(history, target), context);
  context.ttystory = target;
};
