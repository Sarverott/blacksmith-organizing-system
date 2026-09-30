export default async ({ bos, operands: [file, source], flags }) => {
  const context = await bos.workshop.describe(
    flags.hook
      ? { file, source }
      : {}
  );
  if (flags.hook) {
    return undefined;
  }
  return context.message ?? "nothing staged";
};
