// Opening: read the machine, load the setup, make the workshop whole, record it.
import { BasicProcedure } from "../basic-procedure.mjs";
import { bootstrap } from "./bootstrap.mjs";
import { envRead } from "./env-read.mjs";
import { setupLoad } from "./setup-load.mjs";

const recordOpening = new BasicProcedure("record-opening").step("record opening", (context) => {
  const storylines = context.workshop.storylines.ensure(context);
  context.event = storylines.record({ event: "open", user: context.env.user, from: context.workshopSource }, context);
});

export const openWorkshop = envRead
  .chain(setupLoad)
  .chain(bootstrap)
  .chain(recordOpening, "open-workshop");
