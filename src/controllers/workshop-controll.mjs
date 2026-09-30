// Remote of the workshop: its flows as plain methods.
//   const workshop = new WorkshopControll({ workshop: "/tmp/x/__WORKSHOP" });  await workshop.open();
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
  mode(mode) {
    return this.run("modeSwitching", { mode });
  }
}

export default WorkshopControll;
