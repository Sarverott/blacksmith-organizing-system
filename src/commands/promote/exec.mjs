export default async ({ bos, flags }) =>
  new bos.views.PromotionView().render(
    await bos.workshop.promote({ reject: Boolean(flags.reject), apply: Boolean(flags.apply) }),
    flags.json ? "json" : "text"
  );
