export default async ({ bos, operands: [file, source], flags }) => {
  const context = await bos.workshop.describe({
    ...(flags.hook ? { file, source } : {}),
    ...(flags.skryba === "0" || flags.plain ? { skryba: false } : {}),
  });
  if (flags.hook) {
    return undefined;
  }
  const note = context.skryba && !context.skryba.used ? `\n# Skryba: ${context.skryba.reason}` : "";
  return (context.message ?? "nothing staged") + note;
};
