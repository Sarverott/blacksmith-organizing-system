# Skilling Protocol

Every model of the workshop can grow its own agent skill. This protocol drafts
`skills/bos-<type>/SKILL.md` for each standalone model that has no skill yet.
The draft takes its title, "What it is" and "Where" from
`docs/glossary/<type>.md`, and its submodules from the model class. It then
registers the skill in `.claude-plugin/marketplace.json`.

Existing skills are never overwritten: a draft is only a starting point, and it
grows by hand. Submodules get no skill of their own; they belong to their
owner's skill. Re-run it after adding a model.
