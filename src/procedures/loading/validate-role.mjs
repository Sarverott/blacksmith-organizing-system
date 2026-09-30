import { HOST_ROLES } from "../../models/system/host-roles.mjs";

export const validateRole = (context) => {
  const { role } = context.config;
  if (role && !(role in HOST_ROLES)) {
    throw new Error(`unknown host role "${role}" in workshop.json (known: ${Object.keys(HOST_ROLES).join(", ")})`);
  }
};
