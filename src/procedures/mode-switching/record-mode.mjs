export const recordMode = (context) => {
  if (context.previousMode === context.config.mode) return;
  const storylines = context.workshop.storylines.ensure(context);
  context.event = storylines.record(
    { event: "mode", from: context.previousMode, to: context.config.mode, user: context.env.user },
    context,
  );
};
