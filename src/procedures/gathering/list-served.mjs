import OllamaLink from "../../bridge/ollama-link/_index.mjs";

// what ollama serves right now (names, architectures, parents); listing starts no model.
// null when ollama is unreachable
export const listServed = async (context) => {
  const ollama = context.options.ollama ?? new OllamaLink();
  const catalog = await ollama.catalog();
  context.catalog = catalog.length ? catalog : null;
};
