import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { BOS } from "../src/index.mjs";

// a fresh, not yet existing workshop path, and a loaded BOS pointed at it
export async function sandbox() {
  const root = join(mkdtempSync(join(tmpdir(), "bos-")), "__WORKSHOP");
  const bos = await new BOS({ workshop: root }).load();
  return { root, bos, workshop: bos.workshop };
}
