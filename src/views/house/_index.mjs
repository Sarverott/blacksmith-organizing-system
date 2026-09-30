// The House of Anubis: children (adopted by name), orders (duties), bloodlines (releasers).
import { BOS } from "../../main.ts";
import { header, pad, paint } from "../terminal/paint.mjs";

const STATE = { active: paint.green, resting: paint.magenta, frozen: paint.blue };

const presence = (member) => {
  if (member.state && member.state !== "active") return (STATE[member.state] ?? paint.dim)(`◌ ${member.state}`);
  if (member.present === null) return paint.dim("remote");
  return member.present ? paint.green("● served") : paint.dim("○ absent");
};

function group(group) {
  const lines = [
    `${paint.bold(group.title ?? group.name)}  ${(STATE[group.state] ?? paint.dim)(group.state)}  ${paint.dim(group.description ?? "")}`,
  ];
  if (group.state === "resting") lines.push(`  ${paint.magenta("rests by its own decision; not called")}`);
  for (const member of group.members) {
    const label =
      member.name && member.model ? `${member.name} ${paint.dim(`(${member.model})`)}` : (member.name ?? member.model);
    const line = member.bloodline ? paint.dim(`${member.bloodline.releaser} ← ${member.bloodline.root}`) : "";
    const about = member.duty ? paint.cyan(member.duty) : paint.dim(member.note ?? "");
    lines.push(`  ${pad(label, 46)} ${pad(presence(member), 10)} ${pad(line, 36)} ${about}`);
  }
  return lines.join("\n");
}

export class HouseView extends BOS.View {
  data({ children, orders, bloodlines, catalog }) {
    return { reachable: catalog !== null, children, orders, bloodlines };
  }

  text({ children = [], orders = [], bloodlines = [], catalog, options = {} }) {
    const lines = [header("House of Anubis"), ""];
    if (catalog === null) lines.push(paint.yellow("ollama unreachable: presence and bloodlines unknown"), "");
    lines.push(paint.yellow("Children of Anubis") + paint.dim("  adopted by name"), "");
    for (const child of children) lines.push(group(child), "");
    lines.push(paint.yellow("Orders") + paint.dim("  duties"), "");
    for (const order of orders) lines.push(group(order), "");
    if (bloodlines.length) {
      lines.push(
        paint.yellow("Bloodlines") + paint.dim("  every served model by releaser, through its parent_model"),
        "",
      );
      for (const { releaser, models } of bloodlines) {
        lines.push(
          `  ${pad(releaser, 30)} ${paint.bold(models.length)}${options.all ? `  ${paint.dim(models.join(", "))}` : ""}`,
        );
      }
      if (!options.all) lines.push(paint.dim("  bos house --all lists every model"));
    }
    return lines.join("\n");
  }
}

export default HouseView;
