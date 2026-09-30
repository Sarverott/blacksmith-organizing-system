// Closing: keep the shell history as a ttystory and record the closing.
// Bash writes history on exit; run `history -a` first to include the current shell.
import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { BasicProcedure } from "../basic-procedure.mjs";
import { createIfMissing } from "../basic-model.mjs";
import { envRead } from "./env-read.mjs";
import { setupLoad } from "./setup-load.mjs";

const closing = new BasicProcedure("closing")
  .step("capture ttystory", (context) => {
    const storylines = context.workshop.storylines.ensure(context);
    const history = process.env.HISTFILE || join(context.env.home, ".bash_history");
    if (!existsSync(history)) return;
    const target = storylines.file("ttystories", storylines.ttystoryName(context));
    createIfMissing(target, () => copyFileSync(history, target), context);
    context.ttystory = target;
  })
  .step("record closing", (context) => {
    context.event = context.workshop.storylines.record(
      { event: "close", user: context.env.user, ttystory: context.ttystory ?? null },
      context
    );
  });

export const closeWorkshop = envRead.chain(setupLoad).chain(closing, "close-workshop");
