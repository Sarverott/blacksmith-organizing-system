// Remote of the House of Anubis: residents, their states, the ravens.
import { BOS } from "../main.ts";
import procedures from "../procedures/_index.mjs";

export class HouseControll extends BOS.Controll {
  static flows = procedures;

  gather(options) {
    return this.run("gathering", options);
  }
}

export default HouseControll;
