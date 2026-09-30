// status, then offer to create what is missing
import { paint } from "../../views/terminal/paint.mjs";

const missing = (node) => [...(!node.exists && node.mandatory ? [node.path] : []), ...node.children.flatMap(missing)];

export default async ({ bos, io }) => {
  const context = await bos.workshop.status();
  console.log(new bos.views.StatusView().text(context));
  const absent = missing(context.tree);
  if (!absent.length) return paint.green("\nnothing missing");
  const answer = await io.question(`\n${absent.length} missing: create them now? [y/N] `);
  if (!/^y(es)?$/i.test(answer.trim())) return paint.dim("left as it is");
  return new bos.views.StatusView().text(await bos.workshop.bootstrap());
};
