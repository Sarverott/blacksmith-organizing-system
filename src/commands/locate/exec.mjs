export default async ({ bos, flags }) =>
  new bos.views.StatusView().render(await bos.workshop.locate(), flags.json ? "json" : "text");
