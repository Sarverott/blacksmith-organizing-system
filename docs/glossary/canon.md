# Canon

> DRAFT

## What it is

The authoritative, complete record of all work. It is held by the one
*canon monolith* host in the [setternet](setternet.md), and in the repository
flow by the `canonical` branch, which only the **Canon Keeper** confirms.

## Why it exists

With many hosts and many copies, one of them has to be the truth. Canon is the
copy that must be complete and continuous. Everything else can be rebuilt
from it.

## Lifecycle

forge → archive (sarcophags) → canon monolith

Repository flow ([branch movement procedures](../infographics/branch-movement-procedures.md)),
the minimal branches of every repository:

| Branch | Role |
| ------ | ---- |
| `master` | spine of canon: the stable state shared with production |
| `developement` | pulled from master in an opened workshop: here we code |
| `revision` | control of code: approval by a maintainer or someone they authorize |
| `testing` | quality assurance: tests, nightly builds signed with non-release certs |
| `releasing` | stamping, publishing, announcing; lands in master through a pull request |

A rejection at revision, testing or releasing sends work back to developement.
`bos promote` walks this flow (`src/procedures/promoting/`).

Older plan (old core `docs/README.md`): development → testing → master →
canonical (confirmed by the Canon Keeper).

## Open questions

- Who or what the Canon Keeper is (a person, an automated procedure, both?) [`TODO`]
- The old core repo also has `drafting`, `moderation`, `publishing`: are they part of the flow? [`TODO`]
