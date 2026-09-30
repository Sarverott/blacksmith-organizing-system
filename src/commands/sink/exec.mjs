export default async ({ bos, flags }) =>
  new bos.views.InventoryView().render(await bos.workshop.sink(), flags.json ? "json" : "text");
