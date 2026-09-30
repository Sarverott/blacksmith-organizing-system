// Element anatomy shared by models and submodules: a directory plus descriptor
// files (metadata.json, manifest.json, .index.json, Taskfile.yaml, .omnis.toml…).
// A model stands on its own (built from a path); a submodule hangs on its owner
// (built from the owner). Moving a class between the two is one `extends` line.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join, relative, sep } from "node:path";

const MANIFEST_NAMES = ["manifest.json", ".manifest.json"];
const NEVER_SEALED = new Set([".git", "node_modules", ...MANIFEST_NAMES]);

export class BasicElement {
  static type = "element";
  static dirname = null;    // fixed directory name (relative to the parent or owner); null for freely named assets
  static mandatory = true;  // created together with its parent when missing
  static children = [];     // fixed child models (areas)
  static submodules = {};   // { property: Submodule } organs hanging on this element
  static descriptors = {};  // { filename: (element, context) => default content }

  constructor(path, parent = null) {
    this.path = path;
    this.parent = parent;
    // every submodule becomes a lazy property: workshop.storylines
    for (const [name, Submodule] of Object.entries(this.constructor.submodules)) {
      let cached;
      Object.defineProperty(this, name, { get: () => (cached ??= new Submodule(this)), enumerable: false });
    }
  }

  get type() { return this.constructor.type; }
  get name() { return basename(this.path); }
  file(...names) { return join(this.path, ...names); }
  exists() { return existsSync(this.path); }

  // fixed children: areas first, then organs, in declaration order
  childElements() {
    return [
      ...this.constructor.children.map((Child) => new Child(this.file(Child.dirname), this)),
      ...Object.keys(this.constructor.submodules).map((name) => this[name]),
    ];
  }

  // create what is missing and never overwrite; with context.dryRun only plan it
  ensure(context = {}) {
    createIfMissing(this.path, () => mkdirSync(this.path, { recursive: true }), context);
    for (const [name, content] of Object.entries(this.constructor.descriptors)) {
      const target = this.file(name);
      createIfMissing(target, () => writeFileSync(target, serialize(content(this, context))), context);
    }
    for (const child of this.childElements()) {
      if (child.constructor.mandatory) child.ensure(context);
    }
    return this;
  }

  // state of this element and its fixed areas, without touching the disk
  inspect(parentMandatory = true) {
    const mandatory = parentMandatory && this.constructor.mandatory;
    const nodes = this.childElements().map((child) => child.inspect(mandatory));
    return { type: this.type, path: this.path, exists: this.exists(), mandatory, children: nest(nodes) };
  }

  readJSON(name, fallback = null) {
    try {
      return JSON.parse(readFileSync(this.file(name), "utf8"));
    } catch {
      return fallback;
    }
  }

  get manifestName() {
    return MANIFEST_NAMES.find((name) => existsSync(this.file(name)))
      ?? Object.keys(this.constructor.descriptors).find((name) => MANIFEST_NAMES.includes(name))
      ?? MANIFEST_NAMES[0];
  }

  // record checksums of every file into the manifest (integrity guard)
  seal(context = {}) {
    const manifest = this.readJSON(this.manifestName, {});
    manifest.files = Object.fromEntries(
      walkFiles(this.path).map((path) => [relative(this.path, path), sha256(path)])
    );
    manifest.sealedAt = Date.now();
    if (!context.dryRun) writeFileSync(this.file(this.manifestName), serialize(manifest));
    return manifest;
  }

  // compare the manifest checksums with the files on disk
  verify() {
    const manifest = this.readJSON(this.manifestName);
    if (!manifest) return { ok: false, reason: `no ${this.manifestName}`, missing: [], changed: [], unlisted: [] };
    const listed = manifest.files ?? {};
    const missing = [];
    const changed = [];
    for (const [rel, expected] of Object.entries(listed)) {
      const target = this.file(rel);
      if (!existsSync(target)) missing.push(rel);
      else if (sha256(target) !== expected) changed.push(rel);
    }
    const unlisted = walkFiles(this.path).map((path) => relative(this.path, path)).filter((rel) => !(rel in listed));
    return { ok: !missing.length && !changed.length, missing, changed, unlisted };
  }
}

// organs declared with deeper paths (.BOS/storylines) sit under the node of their folder (.BOS)
function nest(nodes) {
  const inside = (node, other) => node !== other && node.path.startsWith(other.path + sep);
  const tops = nodes.filter((node) => !nodes.some((other) => inside(node, other)));
  return tops.map((top) => ({ ...top, children: [...top.children, ...nest(nodes.filter((node) => inside(node, top)))] }));
}

export function createIfMissing(target, create, context = {}) {
  context.changes ??= [];
  if (existsSync(target)) return false;
  if (!context.dryRun) create();
  context.changes.push(target);
  return true;
}

export function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

export function walkFiles(root) {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    if (NEVER_SEALED.has(entry.name)) return [];
    const path = join(root, entry.name);
    if (entry.isDirectory()) return walkFiles(path);
    return entry.isFile() ? [path] : [];
  });
}

function serialize(content) {
  return typeof content === "string" ? content : JSON.stringify(content, null, 2) + "\n";
}
