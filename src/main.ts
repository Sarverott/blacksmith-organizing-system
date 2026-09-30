// The spine of BOS: one class that binds the core mechanics together and
// lazily loads the parts. Core classes hang on it as BOS.Bridge, BOS.Model…,
// so every part extends them through this one import:
//   import { BOS } from "../main.ts";  class DockerHost extends BOS.Bridge {}
import { EventEmitter } from "node:events";

import { BasicBridge } from "./core/basic-bridge.mjs";
import { BasicControll } from "./core/basic-controll.mjs";
import { BasicModel } from "./core/basic-model.mjs";
import { BasicProcedure } from "./core/basic-procedure.mjs";
import { BasicView } from "./core/basic-view.mjs";

type Options = { workshop?: string; dryRun?: boolean; [key: string]: unknown };

export class BOS extends EventEmitter {
  static Bridge = BasicBridge;
  static Controll = BasicControll;
  static Model = BasicModel;
  static Procedure = BasicProcedure;
  static View = BasicView;

  options: Options;
  bridges: Record<string, any> = {};
  models: Record<string, any> = {};
  procedures: Record<string, any> = {};
  controllers: Record<string, any> = {};
  commands: Record<string, any> = {};
  views: Record<string, any> = {};

  constructor(options: Options = {}) {
    super();
    this.options = options;
  }

  // parts import this file, so they are loaded here on demand, never at import time
  async load(): Promise<this> {
    const [bridges, models, procedures, controllers, commands, views] = await Promise.all([
      import("./bridge/_index.mjs"),
      import("./models/_index.mjs"),
      import("./procedures/_index.mjs"),
      import("./controllers/_index.mjs"),
      import("./commands/_index.mjs"),
      import("./views/_index.mjs"),
    ]);
    this.bridges = bridges.default;
    this.models = models.default;
    this.procedures = procedures.default;
    this.controllers = controllers.default;
    this.views = views.default;
    this.commands = await commands.loadCommands();
    this.emit("loaded", this);
    return this;
  }

  // the workshop as one easy handle: bos.workshop.status(), .open(), .close()…
  get workshop() {
    return new this.controllers.WorkshopControll(this.options);
  }

  async command(name: string, operands: string[] = [], flags: Options = {}) {
    const command = this.commands[name];
    if (!command) throw new Error(`unknown command "${name}" (known: ${Object.keys(this.commands).join(", ")})`);
    return command.inline({ bos: this, operands, flags: { ...this.options, ...flags } });
  }

  toString() {
    return `[<Blacksmith_Organization_System::${this.constructor.name}>]`;
  }
}

export default BOS;
