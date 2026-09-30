// The workshop tree drawn with branches and a colored state per area.
import { basename } from "node:path";

import { pad, paint } from "../terminal/paint.mjs";

const mark = (node) =>
  node.exists ? paint.green("●  ok") : node.mandatory ? paint.red("○  missing") : paint.dim("·  not yet");

export function drawTree(node, prefix = "", last = true, root = true) {
  const branch = root ? "" : last ? "└── " : "├── ";
  const name = root ? paint.bold(node.path) : basename(node.path);
  const label = pad(`${prefix}${branch}${name}`, root ? 0 : 40);
  const line = root ? label : `${label} ${paint.dim(pad(node.type, 12))} ${mark(node)}`;
  const childPrefix = root ? "" : prefix + (last ? "    " : "│   ");
  return [
    line,
    ...node.children.map((child, i) => drawTree(child, childPrefix, i === node.children.length - 1, false)),
  ].join("\n");
}
