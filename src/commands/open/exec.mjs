export default async ({ bos, flags }) =>
  new bos.views.StatusView().render(await bos.workshop.open({ dryRun: Boolean(flags.dryRun) }), flags.json ? "json" : "text");
