// Tools of the House of Anubis: bos house <tool>
import { z } from "zod";

import { tool } from "../../core/toolkit.mjs";

export const toolkit = [
  tool({
    name: "show",
    info: "children, orders, bloodlines and each resident's state; resting residents are never called",
    mode: "provision",
    input: { all: z.boolean().optional().describe("also list every model per bloodline") },
    run: async ({ controllers, input }) => ({
      ...(await controllers.house.gather()),
      options: { all: Boolean(input.all) },
    }),
    render: (result, views) => new views.HouseView().text(result),
  }),
];
