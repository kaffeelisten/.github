# Contributing

Applies to every repository in the `kaffeelisten` organisation. A repository's own `AGENTS.md`
wins where it is more specific.

## Before you write code

**Open an issue first** for anything beyond a typo. Not bureaucracy — this project has a live
campus deployment and a narrow scope, so the useful conversation is usually about whether a change
belongs here at all, and that conversation is cheaper before the work than after it.

Read the repository's `AGENTS.md`. It is the canonical contract: the conventions, the gates, and
the things that look like obvious improvements and are deliberately not.

## Things that are deliberate

Pull requests changing these will be declined, however well made:

- **No login for the member-facing flow.** Zero friction is the product. An account is the thing
  that stops it being used.
- **No payment processing** — card, SEPA debit or online payment.
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

For a change large enough to review in layers, use `gh stack` — `init`, `add`, `submit`, and
`gh stack merge` for an atomic all-or-nothing merge. Do not hand-build a stack out of
`gh pr create --base`, and note that a stack has its own number, which is not a pull request
number.

## Before you open a pull request

From the repository root:

```bash
npm run typecheck && npm run typecheck:api && npm run lint && npm test && npm run build
```

And when SQL changed:

```bash
scripts/test-migrations.sh
```

These repositories are npm workspaces — `npm ci` runs at the root, never in a sub-package.

Add a `CHANGELOG.md` entry under `[Unreleased]` for anything user-visible. Internal refactors and
CI tweaks do not need one.

## In the pull request

Say **what changed and why**, and how you verified it. A screenshot for anything visual. If it
touches the database, say what the migration does and whether it is `-- deploy: pre` or
`-- deploy: post`.

CI must pass. A green deployment-status comment from a bot is not a review.

## Secrets

Never commit one. Never paste one into an issue, a pull request or a comment — including in a
screenshot or a log excerpt, which is the usual way it happens. If you think you have exposed one,
say so immediately; rotating a key is a small job and finding out late is not.

## Conduct

[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md). Be straightforward and assume good faith.
