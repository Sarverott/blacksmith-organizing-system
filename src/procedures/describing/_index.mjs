import { BOS } from "../../main.ts";
import { composeDraft } from "./compose-message.mjs";
import { readStaged } from "./read-staged.mjs";
import { writeMessage } from "./write-message.mjs";

export const describing = new BOS.Procedure("describing", [], { description: "draft a conventional commit message from the staged changes" })
  .step("read staged changes", readStaged)
  .step("compose draft", composeDraft)
  .step("write into commit message", writeMessage);

export default describing;
