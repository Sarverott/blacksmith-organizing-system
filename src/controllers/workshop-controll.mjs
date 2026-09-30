// The workshop as a handful of plain methods; each one runs a procedure.
//   const workshop = new WorkshopControll({ workshop: "/tmp/x/__WORKSHOP" });
//   await workshop.open();
import { BOS } from "../main.ts";
import procedures from "../procedures/_index.mjs";

export class WorkshopControll extends BOS.Controll {
  static flows = procedures;

  locate() {
    return this.run("locating");
  }
  status() {
    return this.run("inspecting");
  }
  bootstrap(options) {
    return this.run("bootstrapping", options);
  }
  open(options) {
    return this.run("opening", options);
  }
  close(options) {
    return this.run("closing", options);
  }
  sink() {
    return this.run("sinking");
  }
  hook(hook) {
    return this.run("hooking", { hook });
  }
  installHooks() {
    return this.run("installingHooks");
  }
  describe(options) {
    return this.run("describing", options);
  }
  mode(mode) {
    return this.run("modeSwitching", { mode });
  }
  promote({ reject = false, apply = false } = {}) {
    return this.run("promoting", { reject, dryRun: !apply });
  }
}

export default WorkshopControll;
