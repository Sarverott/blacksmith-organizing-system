import { modeByDigit } from "../../models/workshop/modes.mjs";

// inside `bos repl` the prompt owns the input, so the digit is confirmed with Enter
export default async ({ bos, operands: [asked], io }) => {
  const view = new bos.views.ModeView();

  if (asked === undefined) {
    const { config } = await bos.workshop.status();
    console.log(view.menu(config.mode));
    const digit = Number((await io.question("choose 0-5: ")).trim()[0]);
    if (!digit || digit > 5) {
      return undefined;
    }
    asked = modeByDigit(digit);
  }

  return view.text(await bos.workshop.mode(asked));
};
