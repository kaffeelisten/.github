# What and why

<!-- What changed, and the reason. The diff shows the what; this is for the why. -->

Closes #

<!--
Link the issue this pull request completes: `Closes #12`, or `Closes kaffeelisten/playbook#3` for an
issue in another repository. A stack layer or a partial step says `Refs #12` instead. CI fails without
a link; the `no-issue` label exempts a trivial fix. The author is assigned automatically, the `type:*`
label comes from the title and the milestone from the issue.

Inside a stack, title each layer `[n/N] type(scope): summary` and list the stack here, bottom first.
-->

## How it was verified

<!-- What you actually ran or clicked. "CI is green" is not verification on its own. -->

- [ ] `npm run typecheck && npm run typecheck:api && npm run lint && npm test && npm run build`, from the repo root
- [ ] `scripts/test-migrations.sh` – or not applicable, no SQL changed
- [ ] Checked in a browser or on the tablet – or not applicable, nothing visible changed

## Database

<!-- Delete this section if no SQL changed. -->

- [ ] A migration in `supabase/migrations/`, with its `-- deploy: pre` or `-- deploy: post` tag
- [ ] `database.types.ts` updated
- [ ] `service_role` grants asserted in the migration-grants test
- [ ] A post-deploy migration is in its own follow-up pull request

## Checks

- [ ] `CHANGELOG.md` updated under `[Unreleased]` – or not applicable, nothing user-visible
- [ ] No secret, PIN, key or token in the diff, the description or a screenshot
- [ ] No real member names in fixtures, tests or screenshots
- [ ] Branch name, commits and title follow the conventions in `CONTRIBUTING.md`

## Anything a reviewer should look at first

<!-- The part you are least sure about. Say so – it is the most useful line in a pull request. -->
