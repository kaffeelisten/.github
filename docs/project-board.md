# The board

[Kaffeelisten](https://github.com/orgs/kaffeelisten/projects/1) is one organisation project for every
repository. Issues describe deliverables and pull requests are the review queue. Epics and blocked
work stay off the daily board.

## Views

| View | Layout | Filter | Purpose |
|---|---|---|---|
| [Open work](https://github.com/orgs/kaffeelisten/projects/1/views/1) | Board, Status columns | `is:open -label:"type:epic" -status:Blocked` | What is being worked on, across all repositories |
| [Phases](https://github.com/orgs/kaffeelisten/projects/1/views/2) | Table | `label:"type:epic"` | The build-order epics and their sub-issue progress |
| [Waiting](https://github.com/orgs/kaffeelisten/projects/1/views/3) | Table | `is:open status:Blocked` | Dependencies and decisions |
| [Pull requests](https://github.com/orgs/kaffeelisten/projects/1/views/4) | Table | `is:pr is:open` | Review and merge queue |
| [By repository](https://github.com/orgs/kaffeelisten/projects/1/views/5) | Table, grouped by Repository | `is:open -label:"type:epic"` | The same work, repository by repository |
| [Completed](https://github.com/orgs/kaffeelisten/projects/1/views/6) | Table | `is:closed` | History, including abandoned pull requests |

Grouping and sorting are set in the web interface; the API cannot set them.

## Fields

| Field | Meaning |
|---|---|
| Status | Backlog · Ready · In progress · In review · Blocked · Done |
| Priority | P0 blocks the phase · P1 needed · P2 nice to have |
| Size | XS < 2 h · S half a day · M 1–2 days · L 3–5 days · XL split it |
| Start date | First seen In progress or In review; set once |
| Target date | A real deadline only, set by a founder |
| Completed date | Issue closed or pull request merged |
| Repository, Milestone, Labels, Assignees, Parent issue, Sub-issues progress, Linked pull requests, Reviewers | Native GitHub data |

Priority and Size are triage decisions; nothing sets them automatically. Epics get no size.

## Automation

Every repository calls [`org-conventions.yml`](../.github/workflows/org-conventions.yml) through a
short `conventions.yml`. The scripts are in [`scripts/conventions/`](../scripts/conventions) and are
tested by `Checks` on every pull request here.

| Trigger | Result | Where |
|---|---|---|
| Pull request opened, edited or pushed | Title, `type:*` and issue link checked; author assigned to the PR and the issues it closes; `type:*` from the title; milestone from the issue; `area:*` from `.github/labeler.yml` | PR conventions job |
| `/take`, `/drop` on an issue | Self-assign or unassign; refused for epics, `parked` and blocked issues | Issue command job |
| Sub-issue closed or reopened in the same repository | Parent gets or loses `ready-for-acceptance` | Roll-up job |
| Daily, in `kaffeelisten/.github` | Every open epic checked, whichever repository its children are in | Roll-up job, sweep |
| Issue or pull request event, daily, manual | Item added to the board; Status, Start and Completed dates set | Board sync job, needs `PROJECTS_TOKEN` |

**`PROJECTS_TOKEN`.** `GITHUB_TOKEN` cannot write an organisation project, and on the Free plan
private repositories cannot read organisation secrets. So each repository that should sync the board
carries its own `PROJECTS_TOKEN` secret: a fine-grained token owned by a founder, resource owner
`kaffeelisten`, with **Projects: read and write** at organisation level and **Issues** and **Pull
requests: read** on all repositories, nothing else. Without it the board job prints a notice and
skips; nothing else depends on it. Rotate it before it expires.

**Native workflows** (the project's Workflows page, web only): keep *Item closed* and *Pull request
merged* pointing at Done, *Item added* at Backlog, and turn on *Auto-add sub-issues*. Leave
*Auto-close issue* and *Auto-archive* off, so moving a card never closes an issue and finished work
stays visible. The Free plan allows one *Auto-add to project* workflow; point it at
`kaffeelisten/kaffeelisten` with `is:issue,pr is:open`, and let the token sync add the rest.

Sync never closes issues, merges pull requests or deploys. Ready, Blocked, estimates and epic
acceptance remain founder decisions.
