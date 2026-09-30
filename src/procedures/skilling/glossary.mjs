// Reading glossary pages: the title and the text of one "## " section.
import { existsSync, readFileSync } from "node:fs";

export function readPage(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

export const title = (page) => page.match(/^#\s+(.+)$/m)?.[1].trim() ?? null;

export function section(page, name) {
  const match = page.match(new RegExp(`^##\\s+${name}\\s*$([\\s\\S]*?)(?=^##\\s|(?![\\s\\S]))`, "m"));
  return match ? match[1].replace(/^>.*$/gm, "").trim() : "";
}

// first sentence of the first paragraph, plain text, on one line
export function firstSentence(text) {
  const paragraph = text.split(/\n\s*\n/)[0].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\s+/g, " ").trim();
  return (paragraph.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? paragraph).replace(/:$/, ".");
}
