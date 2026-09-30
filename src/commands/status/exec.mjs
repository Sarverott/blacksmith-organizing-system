export default async ({ bos, flags }) =>
  new bos.views.StatusView().render(await bos.workshop.status(), flags.json ? "json" : "text");
