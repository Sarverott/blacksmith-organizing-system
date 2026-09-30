import { resolve } from "node:path";

import { BOS } from "../../main.ts";

export default ({ operands: [dir = "."], flags }) => {
  const manifest = new BOS.Model(resolve(dir)).seal({ dryRun: Boolean(flags.dryRun) });
  return flags.json ? manifest : `sealed ${Object.keys(manifest.files).length} files`;
};
