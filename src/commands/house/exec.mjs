export default async ({ bos, flags }) =>
  new bos.views.HouseView().render(
    {
      ...(await bos.workshop.gather()),
      options: { all: Boolean(flags.all) },
    },
    flags.json ? "json" : "text",
  );
