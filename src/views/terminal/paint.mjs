// ANSI colors for terminals; plain text for pipes, files and NO_COLOR.
const enabled = process.stdout.isTTY && !process.env.NO_COLOR;
const code = (open, close) => (text) => (enabled ? `\x1b[${open}m${text}\x1b[${close}m` : String(text));

export const paint = {
  bold: code(1, 22),
  dim: code(2, 22),
  red: code(31, 39),
  green: code(32, 39),
  yellow: code(33, 39),
  blue: code(34, 39),
  magenta: code(35, 39),
  cyan: code(36, 39),
};

// visible length, ignoring color codes
// biome-ignore lint/suspicious/noControlCharactersInRegex: \x1b starts the ANSI color codes this strips
export const width = (text) => String(text).replace(/\x1b\[\d+m/g, "").length;
export const pad = (text, size) => text + " ".repeat(Math.max(0, size - width(text)));

export const header = (title) => paint.bold(paint.yellow(`⚒  ${title}`));
export const field = (label, value) => `${paint.dim(pad(label, 10))}${value}`;
