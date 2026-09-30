import { groupOf, sameModel } from "../../models/house/groups.mjs";

// children and orders with presence, bloodline of each served model, and bloodlines grouped by releaser
export const mergeResidents = (context) => {
  const catalog = context.catalog ?? [];
  const served = catalog.map((entry) => entry.name);
  const present = (model) => (context.catalog ? served.some((name) => sameModel(name, model)) : null);
  const withPresence = (group) => {
    const claimed = served
      .filter((model) => groupOf([group], model) && !group.members.some((m) => m.model && sameModel(m.model, model)))
      .map((model) => ({ model, kind: "local" }));
    const members = [...group.members, ...claimed].map((member) => ({
      ...member,
      state: member.state ?? group.state,
      present: member.kind === "remote" ? null : present(member.model),
      bloodline: member.model && context.catalog ? context.house.bloodlineOf(catalog, member.model) : null,
    }));
    return { ...group, members };
  };
  context.children = context.children.map(withPresence);
  context.orders = context.orders.map(withPresence);
  const lines = {};
  for (const model of served) {
    const { releaser } = context.house.bloodlineOf(catalog, model);
    lines[releaser] ??= [];
    lines[releaser].push(model);
  }
  context.bloodlines = Object.entries(lines)
    .map(([releaser, models]) => ({ releaser, models }))
    .sort((a, b) => b.models.length - a.models.length);
};
