// The spine of BOS: one class that binds the core mechanics together and
// lazily loads the parts. Core classes hang on it as BOS.Bridge, BOS.Model,
// BOS.Submodule…,
// so every part extends them through this one import:
//   import { BOS } from "../main.ts";  class DockerHost extends BOS.Bridge {}
import { EventEmitter } from "node:events";

import { BasicBridge } from "./core/basic-bridge.mjs";
import { BasicControll } from "./core/basic-controll.mjs";
import { BasicModel } from "./core/basic-model.mjs";
import { BasicProcedure } from "./core/basic-procedure.mjs";
import { BasicSubmodule } from "./core/basic-submodule.mjs";
import { BasicView } from "./core/basic-view.mjs";

type Options = { workshop?: string; dryRun?: boolean; [key: string]: unknown };
// parts are loaded at runtime (bos.load()) and differ per part, so their registries stay open
// biome-ignore lint/suspicious/noExplicitAny: dynamic registries of classes and functions
type Registry = Record<string, any>;

export class BOS extends EventEmitter {
  static Bridge = BasicBridge;
  static Controll = BasicControll;
  static Model = BasicModel;
  static Procedure = BasicProcedure;
  static Submodule = BasicSubmodule;
  static View = BasicView;

  options: Options;
  bridges: Registry = {};
  models: Registry = {};
  procedures: Registry = {};
  controllers: Registry = {};
  views: Registry = {};

  constructor(options: Options = {}) {
    super();
    this.options = options;
  }

  // parts import this file, so they are loaded here on demand, never at import time
  async load(): Promise<this> {
    const [bridges, models, procedures, controllers, views] = await Promise.all([
      import("./bridge/_index.mjs"),
      import("./models/_index.mjs"),
      import("./procedures/_index.mjs"),
      import("./controllers/_index.mjs"),
      import("./views/_index.mjs"),
    ]);
    this.bridges = bridges.default;
    this.models = models.default;
    this.procedures = procedures.default;
    this.controllers = controllers.default;
    this.views = views.default;
    this.emit("loaded", this);
    return this;
  }

  // the remotes: bos.execution runs tools; bos.workshop / bos.house / bos.repository hold the flows
  get execution() {
    this._execution ??= new this.controllers.ExecutionControll(this.options, {
      models: this.models,
      views: this.views,
    });
    return this._execution;
  }
  get workshop() {
    return this.execution.controllers.workshop;
  }
  get house() {
    return this.execution.controllers.house;
  }
  get repository() {
    return this.execution.controllers.repository;
  }

  // bos.call("workshop", "status") → the tool's result; bos.run(["workshop", "status"]) → rendered text
  async call(model: string, tool: string, input: Record<string, unknown> = {}) {
    return (await this.execution.call(model, tool, input)).result;
  }
  run(args: string[], extras: Record<string, unknown> = {}) {
    return this.execution.dispatch(args, extras);
  }

  toString() {
    return `[<Blacksmith_Organization_System::${this.constructor.name}>]`;
  }
}

export default BOS;
