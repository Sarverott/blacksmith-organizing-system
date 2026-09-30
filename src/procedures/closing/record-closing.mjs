export const recordClosing = (context) => {
  context.event = context.workshop.storylines.record(
    { event: "close", user: context.env.user, ttystory: context.ttystory ?? null },
    context,
  );
};
