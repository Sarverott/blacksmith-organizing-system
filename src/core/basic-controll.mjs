// A controll owns a set of logicflows and runs them with a prepared context.
import { EventEmitter } from "node:events";

export class BasicControll extends EventEmitter {
  static flows = {};

  constructor(options = {}) {
    super();
    this.options = options;
  }

  get flowNames() { return Object.keys(this.constructor.flows); }

  async run(flowName, options = {}) {
    const flow = this.constructor.flows[flowName];
    if (!flow) throw new Error(`unknown logicflow "${flowName}" (known: ${this.flowNames.join(", ")})`);
    const merged = { ...this.options, ...options };
    const context = { options: merged, dryRun: Boolean(merged.dryRun), changes: [], trace: [] };
    this.emit("start", flowName, context);
    await flow.run(context);
    this.emit("done", flowName, context);
    return context;
  }
}
