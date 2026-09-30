// One shared handler for every way BOS presents state (CLI text, JSON for
// web / OpenAPI / MCP, ...). Subclasses only describe how state reads as text.

export class BasicView {
  static formats = ["text", "json"];

  render(state, format = "text") {
    if (format === "json") return JSON.stringify(this.data(state), null, 2);
    if (format === "text") return this.text(state);
    throw new Error(`unknown view format "${format}" (known: ${this.constructor.formats.join(", ")})`);
  }

  // what a machine interface receives; defaults to the whole state
  data(state) {
    return state;
  }

  text(state) {
    return String(state);
  }
}
