export default async ({ bos, flags }) =>
  new bos.views.SkillsView().render(
    await bos.skills.scaffold({ dryRun: Boolean(flags.dryRun) }),
    flags.json ? "json" : "text",
  );
