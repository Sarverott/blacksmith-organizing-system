export default async ({ bos, flags }) => {
  const context = await bos.workshop.close();
  return flags.json ? context.event : `closed · ttystory: ${context.ttystory ?? "no shell history found"}`;
};
