# skills

`bos skills [--dry-run]` drafts `skills/bos-<type>/SKILL.md` for every model
that has no skill yet, using its glossary page and model class, and registers
it in `.claude-plugin/marketplace.json`. Existing skills are never overwritten.
