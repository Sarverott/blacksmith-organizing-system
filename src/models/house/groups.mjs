// Children (adopted by name) and orders (duties): one JSON file per group,
// with explicit members and/or name patterns that claim served models.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

// "tulu3:latest" and "tulu3" are the same resident
export const sameModel = (a, b) =>
  a?.replace(/:latest$/i, "").toLowerCase() === b?.replace(/:latest$/i, "").toLowerCase();

export function readGroups(dir, ravens = []) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => {
      const group = {
        name: basename(file, ".json"),
        state: "active",
        patterns: [],
        members: [],
        ...JSON.parse(readFileSync(join(dir, file), "utf8")),
      };
      const fromRavens = group.fromRavens
        ? ravens.map((raven) => ({ name: raven.name, model: raven.model, duty: raven.duty }))
        : [];
      group.members = [...fromRavens, ...group.members].map((member) => ({
        kind: member.model ? "local" : "remote",
        ...member,
      }));
      return group;
    });
}

const claims = (group, model) =>
  group.members.some((member) => member.model && sameModel(member.model, model)) ||
  group.patterns.some((pattern) => model.toLowerCase().includes(pattern.toLowerCase()));

export const groupOf = (groups, model) => groups.find((group) => claims(group, model ?? ""));
