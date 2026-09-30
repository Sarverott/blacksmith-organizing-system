import { BOS } from "../../main.ts";
import loading from "../loading/_index.mjs";

const own = new BOS.Procedure("inspecting").step("inspect tree", (context) => {
  context.tree = context.workshop.inspect();
});

export const inspecting = loading.chain(own, "inspecting");
export default inspecting;
