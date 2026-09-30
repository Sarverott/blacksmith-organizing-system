# Project

> DRAFT

## What it is

One concrete, independent project with its own name and a focused workflow,
set up to be a project repository.

## Why it exists

It's the basic unit of crafting: something with a clear goal that can be built,
released and archived on its own.

## Where

Inside a [scope](scope.md): `forge/<scope>/<project>`.

## Lifecycle

Opened in the forge → released (release posts go through the *market stall*
host) → archived as a [sarcophag](sarcophag.md).

## Anatomy

Every project carries the same standard parts, so people, BOS and agents find
things without asking (`src/models/project/anatomy.mjs`):

| Part | Role |
| ---- | ---- |
| `README.md` | what it is and how to use it |
| `LICENSE` | terms of use |
| `AGENTS.md` | instructions for AI agents working on it; `CLAUDE.md` imports it (`@AGENTS.md`) |
| `Taskfile.yml` | its procedures: build, test, run |
| `src/` | source code |
| `docs/` | documentation; long-lived knowledge promoted from scrapnotes |
| `tests/` | tests |
| `.github/` | community files (CONTRIBUTING, SECURITY, CODE_OF_CONDUCT) and CI workflows |

Its branches follow the [canon](canon.md) flow: `master` → `developement` →
`revision` → `testing` → `releasing` → `master`.

A project knows its place from its path: `forge/<scope>/<project>`
(`bos workshop locate` prints it).

## Relations

Code that realizes a design is a project, even when it starts from a sheme
(e.g. a layout template).
