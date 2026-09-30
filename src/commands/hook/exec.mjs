export default async ({ bos, operands: [name] }) => {
  await bos.workshop.hook(name);
};
