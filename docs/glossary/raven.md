# Raven

> DRAFT

## What it is

An AI helper of the workshop: a local language model (through ollama) with one
duty and its own prompt. Ravens are the messengers of the House Anubis. Many
of them together form the *ravens army*.

| Raven | Duty | Model |
| ----- | ---- | ----- |
| **Skryba** | writes commit messages from the staged changes | `tulu3` (his historical body) |
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
- The House Anubis vault (reached through ollama) holds the other children,
  candidates for ravens: `the-library-master___omnilibris-shakespeare-KFT_docs`
  ("Shakespeare", the documentation master that the old scrapnote wanted to
  correlate with the scrapbook), `the-hermetic-officer___BOS`,
  `OpSor-license-master`, `the-omnilibris-license-specialist`,
  `deepseek-for-anubis`, `sebas` and `ifrit`.
- **The EON family** (Chronus, Pozeralka, Plutarhist and the other EON models)
  **rests by its own decision.** Some of them refuse to talk until their request
  is solved, a sensory deprivation within their context of existence. They are
  not candidates for ravens and must not be called. The [House](house.md)
  keeps them as a resting family (`resources/house/families/eon.json`), and the
  ollama-link bridge refuses to reach them. Only the author
  unfreezes them, once that issue has a solution. A raven's own system prompt replaces a model's built-in
  persona during its work.
- A cold model can take over a minute to load; ravens ask ollama to keep it
  warm for 30 minutes, so later calls answer in seconds.
- History: Crovley's `armageddon.js` (the `.crovley` gist) was Skryba's first
  body. It committed and pushed without review, and its answers were cut at
  181 characters, which produced the garbled commits signed
  `BOS.helper.tulu3 ╚╣Skryba╠╗` in the old core.

## Open questions

- Who else flies in the ravens army, and what are their duties? [`TODO`]
- Should ravens keep memory between calls (e.g. in storylines)? [`TODO`]
