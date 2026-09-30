import { resolve } from "node:path";

import { BOS } from "../../main.ts";

export default ({ operands: [dir = "."] }) => {
  const result = new BOS.Model(resolve(dir)).verify();
  if (!result.ok) process.exitCode = 1;
  return result;
};
