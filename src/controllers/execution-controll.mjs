// Remote of the main process: gathers every model's tools into one registry, validates
// input, routes a call to the model's tool with the remotes it needs, and renders the result.
// The CLI, the repl, MCP and OpenAPI are all views of this one registry.

import { parseArgs, parseInput } from "../core/toolkit.mjs";
import { BOS } from "../main.ts";
import HouseControll from "./house-controll.mjs";
import RepositoryControll from "./repository-controll.mjs";
import WorkshopControll from "./workshop-controll.mjs";

// results hold models (with parent links): machines get their paths instead
const plain = (_key, value) => (value instanceof BOS.Model || value instanceof BOS.Submodule ? value.path : value);

export class ExecutionControll extends BOS.Controll {
  constructor(options = {}, { models, views } = {}) {
    super(options);
    this.models = models;
    this.views = views;
  }

  get controllers() {
    this._controllers ??= {
      workshop: new WorkshopControll(this.options),
      house: new HouseControll(this.options),
      repository: new RepositoryControll(this.options),
    };
    return this._controllers;
  }

  // every tool of every model: { model, name, info, mode, input, positional, readOnly, run, render }
  get tools() {
    this._tools ??= Object.values(this.models).flatMap((Model) =>
      Model.toolkit.map((entry) => ({ ...entry, model: Model.type })),
    );
    return this._tools;
  }

  find(model, name) {
    const entry = this.tools.find((t) => t.model === model && t.name === name);
    if (entry) return entry;
    const ofModel = this.tools.filter((t) => t.model === model).map((t) => t.name);
    if (!ofModel.length)
      throw new Error(
        `unknown model "${model}" (with tools: ${[...new Set(this.tools.map((t) => t.model))].join(", ")})`,
      );
    throw new Error(`${model} has no tool "${name}" (tools: ${ofModel.join(", ")})`);
  }

  async call(model, name, input = {}, { ask } = {}) {
    const entry = this.find(model, name);
    const result = await entry.run({ controllers: this.controllers, input, ask, views: this.views });
    this.emit("called", entry, input, result);
    return { entry, result };
  }

  render(entry, result, format = "text") {
    if (format === "json") return JSON.stringify(result ?? null, plain, 2);
    return entry.render ? entry.render(result, this.views) : JSON.stringify(result ?? null, plain, 2);
  }

  // ["workshop", "status", "--json"] → rendered output
  async dispatch(args, { ask } = {}) {
    const { operands, flags } = parseArgs(args);
    const [model, name, ...rest] = operands;
    const entry = this.find(model, name);
    const input = parseInput(entry, rest, flags);
    const { result } = await this.call(model, name, input, { ask });
    return this.render(entry, result, flags.json ? "json" : "text");
  }
}

export default ExecutionControll;
