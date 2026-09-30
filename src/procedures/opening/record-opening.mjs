export const recordOpening = (context) => {
  const storylines = context.workshop.storylines.ensure(context);
  context.event = storylines.record({ event: "open", user: context.env.user, from: context.workshopSource }, context);
};
