// Reusable kit of notes, notebooks, scripts and session setup (glossary: craftset).
import { BOS } from "../../main.ts";

export class Craftset extends BOS.Model {
  static type = "craftset";
  static descriptors = {
    ".omnis.toml": () => "# [TODO] contents of .omnis.toml are not defined yet\n",
    "metadata.json": (element) => ({ name: element.name, created: Date.now() }),
    "manifest.json": () => ({ files: {} }),
    "Taskfile.yaml": () => "version: '3'\n\ntasks: {}\n",
  };
}

export default Craftset;
