// One digit, no Enter: 0…max on a terminal. From a pipe: the first digit of the first line.
// Anything else, Ctrl+C or end of input counts as 0 (leave).
import readline from "node:readline";

export function chooseDigit(prompt, max, { input = process.stdin, output = process.stdout } = {}) {
  output.write(prompt);
  return new Promise((resolve) => {
    const done = (digit) => {
      output.write(`${digit}\n`);
      resolve(digit);
    };
    if (input.isTTY) {
      readline.emitKeypressEvents(input);
      input.setRawMode(true);
      input.resume();
      const onKey = (text, key = {}) => {
        const digit = key.ctrl && key.name === "c" ? 0 : /^\d$/.test(text ?? "") ? Number(text) : null;
        if (digit === null || digit > max) return;
        input.off("keypress", onKey);
        input.setRawMode(false);
        input.pause();
        done(digit);
      };
      input.on("keypress", onKey);
    } else {
      const lines = readline.createInterface({ input });
      let answered = false;
      lines.once("line", (line) => {
        answered = true;
        const digit = Number(line.trim()[0]);
        lines.close();
        done(Number.isInteger(digit) && digit <= max ? digit : 0);
      });
      lines.once("close", () => answered || done(0));
    }
  });
}
