# .github

Organisation-wide defaults for [`kaffeelisten`](https://github.com/kaffeelisten). This repository
holds no application code.

| Path | What it does |
|---|---|
| `profile/README.md` | The organisation's public profile page. |
| `profile/assets/` | The mark, in a light and a dark variant. |
| `SECURITY.md` | How to report a vulnerability. Applies to every repository. |
| `CONTRIBUTING.md` | Conventions, the gates, and the decisions that are deliberate. |
| `CODE_OF_CONDUCT.md` | How we deal with each other. |
| `.github/ISSUE_TEMPLATE/` | Default issue forms, plus the contact links. |
| `.github/PULL_REQUEST_TEMPLATE.md` | Default pull request template. |

A file here applies to every repository in the organisation **that does not have its own copy**. A
repository's own version always wins, which is the way to make an exception.

## Editing it

`profile/README.md` is public and is the first thing anyone sees. Keep it in the project's voice:
warm, direct, concise, no emojis, and no marketing register.

The mark is a one-line SVG in the brand amber (`#D97706` light, `#F59E0B` dark) with the counter
line in stone. Referenced by absolute `raw.githubusercontent.com` URL inside a `<picture>` element,
because GitHub strips inline SVG from Markdown and relative paths do not resolve on the profile
page.

Changing a template here changes it for every repository at once. Check the forms still render —
a malformed `.yml` fails silently and the form simply stops appearing.
