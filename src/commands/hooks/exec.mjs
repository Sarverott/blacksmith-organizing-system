export default async ({ bos, operands: [action] }) => {
  if (action !== "install") throw new Error("usage: bos hooks install");
  const context = await bos.workshop.installHooks();
  return { installed: context.changes, skipped: context.skipped };
};
