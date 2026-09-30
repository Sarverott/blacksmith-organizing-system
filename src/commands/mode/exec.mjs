import { modeByDigit } from "../../models/workshop/modes.mjs";

export default async ({ bos, operands: [asked], flags }) => {
  const view = new bos.views.ModeView();
  const format = flags.json ? "json" : "text";

  if (asked === undefined) {
    const { config } = await bos.workshop.status();
    const digit = await bos.views.chooseDigit(`${view.menu(config.mode)}choose 0-5: `, 5);
    if (digit === 0) {
      return undefined;
    }
    asked = modeByDigit(digit);
  }

  return view.render(await bos.workshop.mode(asked), format);
};
