# Raven

> DRAFT

## What it is

An AI helper of the workshop: a local language model (through ollama) with one
duty and its own prompt. Ravens are the messengers of the House Anubis. Many
of them together form the *ravens army*.

| Raven | Duty | Model |
| ----- | ---- | ----- |
| **Skryba** | writes commit messages from the staged changes | `llama3` |
| [`TODO`] | more to come back from the ravens army | |

## Why it exists

Some work needs judgement over text: summarizing a change, describing a
release, sorting a throwbox. A raven brings that judgement, locally and
privately, without leaving the machine.

A raven proposes; people decide. Every raven works inside a procedure that
checks its answer and falls back to plain BOS logic when the answer is missing
or unusable.

## Where

`resources/ravens/<name>.md`: frontmatter with `model` and `duty`, then the
raven's system prompt. Reached through the `ollama-link` bridge (`$OLLAMA_HOST`).
`BOS_<NAME>_MODEL` overrides a raven's model, e.g. `BOS_SKRYBA_MODEL=sebas`.

## Relations

- Skryba works in the describing procedure (SMELTRY), in husky's `prepare-commit-msg`.
- The ollama models on the author's machine include `sebas` and `ifrit`,
  personas of the House Anubis. A raven's own system prompt replaces a
  model's persona during its work.
- History: Crovley's `armageddon.js` (the `.crovley` gist) was Skryba's first
  body. It committed and pushed without review, and its answers were cut at
  181 characters, which produced the garbled commits signed
  `BOS.helper.tulu3 ╚╣Skryba╠╗` in the old core.

## Open questions

- Who else flies in the ravens army, and what are their duties? [`TODO`]
- Should ravens keep memory between calls (e.g. in storylines)? [`TODO`]
