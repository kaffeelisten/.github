# Contributing

Applies to every repository in the `kaffeelisten` organisation. A repository's own `AGENTS.md`
wins where it is more specific.

## Before you write code

**Open an issue first** for anything beyond a typo. Not bureaucracy – this project has a live
campus deployment and a narrow scope, so the useful conversation is usually about whether a change
belongs here at all, and that conversation is cheaper before the work than after it.

Read the repository's `AGENTS.md`. It is the canonical contract: the conventions, the gates, and
the things that look like obvious improvements and are deliberately not.

## Things that are deliberate

Pull requests changing these will be declined, however well made:

- **No login for the member-facing flow.** Zero friction is the product. An account is the thing
  that stops it being used.
- **No payment processing** – card, SEPA debit or online payment.
- **Nothing is deleted.** Months are archived; archives are kept indefinitely.
- **Migrations are the only path to a schema change.** No editing schema in a dashboard, ever.
- **German-first UI copy.** English for developer-facing labels and code comments.
- **No `any`**, and no `ts-ignore` without a comment saying why.

## Branches and commits

```
feat/<slug>     fix/<slug>     chore/<slug>
docs/<slug>     refactor/<slug>     test/<slug>     ci/<slug>
```

Branch off an up-to-date `main`. Never push to `main`.

**Conventional Commits**, subject 72 characters or fewer, lowercase after the colon, no trailing
period. A body only when the *why* is not obvious from the diff.

```
feat(ui): add company selector screen
fix(api): handle missing CRON_SECRET env var
```

One logical change per commit. Several small commits read better than one large one.

**No co-authorship trailers and no tool-attribution lines** in commit messages, pull requests or
changelog entries.

## Stacked pull requests

For a change large enough to review in layers, use `gh stack` – `init`, `add`, `submit`, and
`gh stack merge` for an atomic all-or-nothing merge. Do not hand-build a stack out of
`gh pr create --base`, and note that a stack has its own number, which is not a pull request
number.

## Issues, labels and the board

Every repository uses the same labels, milestones and board. The machinery lives in this repository
and each repository calls it with one short workflow, so the rules below are checked, not hoped for.

**Labels.** Exactly one `type:*` on every issue and pull request, at least one `area:*`.

| Label | Meaning |
|---|---|
| `type:epic` | One phase of the build order. Lives here in `kaffeelisten/.github`. |
| `type:story` | Something a user can do afterwards that they could not before. |
| `type:task` | Work with a clear finish line that is not a feature: docs, CI, refactors, operations. |
| `type:spike` | A time-boxed question whose answer decides an approach. |
| `type:bug` | Something behaves differently from how it should. |
| `area:*` | Where the change lands. Each repository has its own set, applied to pull requests from the changed paths by `.github/labeler.yml`. |
| `needs-triage` | New; nobody has looked at it yet. |
| `needs-decision` / `needs-design` | Waiting on a founder decision, or on a design. |
| `ready-for-acceptance` | Every sub-issue of an epic is closed. Check the outcome, then close the epic. |
| `parked` | Deliberately not now. `/take` refuses it. |
| `no-issue` | A pull request too small to need an issue. Use it rarely. |

Priority and size are board fields, not labels.

**Milestones** are the phases of the build order and carry the same names in every repository:
`P0 · Organisation hygiene`, `P1 · Move the product`, `P2 · The public face`,
`P3 · The demo and production readiness`, `P4 · Provider spaces and the first campus`.

**Epics.** One per phase, here in `kaffeelisten/.github`, titled `[P2] The public face`. Stories,
tasks and spikes in any repository hang under it as native **sub-issues**, and an issue that cannot
start until another closes says so with a native **blocked by** link. When the last sub-issue closes,
the epic gets `ready-for-acceptance`; it is never closed automatically.

**Taking an issue.** Comment `/take` on an open, unblocked issue to assign yourself and get the branch
name to use; `/drop` gives it back. Epics and `parked` issues cannot be taken.

**The board** is the organisation project
[Kaffeelisten](https://github.com/orgs/kaffeelisten/projects/1): every issue and pull request from
every repository, with Status (Backlog · Ready · In progress · In review · Blocked · Done), Priority
(P0 blocks the phase · P1 needed · P2 nice to have), Size (XS < 2 h · S half a day · M 1–2 days · L 3–5
days · XL split it) and Start, Target and Completed dates. Its views and automation are described in
[`docs/project-board.md`](docs/project-board.md).

## Before you open a pull request

From the repository root:

```bash
npm run typecheck && npm run typecheck:api && npm run lint && npm test && npm run build
```

And when SQL changed:

```bash
scripts/test-migrations.sh
```

These repositories are npm workspaces – `npm ci` runs at the root, never in a sub-package.

Add a `CHANGELOG.md` entry under `[Unreleased]` for anything user-visible. Internal refactors and
CI tweaks do not need one.

## In the pull request

**Link the issue.** `Closes #12` for the issue the pull request completes, `Closes kaffeelisten/playbook#3`
for one in another repository, `Refs #12` for a stack layer or a partial step. The `PR conventions`
check fails without a link, a Conventional Commits title, or with more than one `type:*` label. It also
does the bookkeeping: it assigns the author to the pull request and to the issues it closes, adds the
`type:*` label the title implies (`feat` → story, `fix` → bug, anything else → task), copies the
milestone from the issue, and the labeler adds `area:*` from the changed paths.

Inside a stack, title each layer `[n/N] type(scope): summary` and list the whole stack in every body.

Say **what changed and why**, and how you verified it. A screenshot for anything visual. If it
touches the database, say what the migration does and whether it is `-- deploy: pre` or
`-- deploy: post`.

CI must pass. A green deployment-status comment from a bot is not a review.

## Merging

**Merge commits only.** Squash and rebase merging are switched off in every repository, so the
history keeps each commit and each stack layer as it was reviewed. Branches are not deleted on merge,
because a stack's upper layers still point at them; delete them once the whole stack has landed.
Only the founders merge to `main`.

## Secrets

Never commit one. Never paste one into an issue, a pull request or a comment – including in a
screenshot or a log excerpt, which is the usual way it happens. If you think you have exposed one,
say so immediately; rotating a key is a small job and finding out late is not.

## Conduct

[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md). Be straightforward and assume good faith.
