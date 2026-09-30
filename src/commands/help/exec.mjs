export default ({ bos, operands: [name], flags }) => {
  const view = new bos.views.HelpView();
  const state = { commands: bos.commands, command: name, help: name && bos.commands[name]?.help() };
  if (name && !bos.commands[name]) throw new Error(`unknown command "${name}"`);
  return view.render(state, flags.json ? "json" : "text");
};
