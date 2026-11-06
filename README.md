# .github

Organisation-wide defaults for [`kaffeelisten`](https://github.com/kaffeelisten). This repository
holds no application code.

| Path | What it does |
|---|---|
| `profile/README.md` | The organisation's public profile page. |
| `brand/BRAND.md` | **The brand book** — wordmark, logo, palette, the visual world and the system that generates it. |
| `brand/logo/` | Logo and mark SVGs, palette variants, and the 512&times;512 avatar. |
| `brand/plates/` | The approved plate behind each surface, drawn at that surface's own size, plus kept plates nothing ships from — `readme-filter.png`, the fluted fan that was the README banner until 6 November 2026, and `wide.png`. Both are kept on purpose; nothing cutting from a plate is not a reason to drop it. |
| `brand/assets/` | Every shipped surface: social previews, banners, square, story, print. |
| `SECURITY.md` | How to report a vulnerability. Applies to every repository. |
| `CONTRIBUTING.md` | Conventions, the gates, and the decisions that are deliberate. |
| `CODE_OF_CONDUCT.md` | How we deal with each other. |
| `.github/ISSUE_TEMPLATE/` | Default issue forms, plus the contact links. |
| `.github/PULL_REQUEST_TEMPLATE.md` | Default pull request template. |

A file here applies to every repository in the organisation **that does not have its own copy**. A
repository's own version always wins, which is the way to make an exception.

## Editing it

`profile/README.md` is public and is the first thing anyone sees. Keep it in the project's voice:
warm, direct, concise, no emojis, and no marketing register. **Read [`brand/BRAND.md`](brand/BRAND.md)
before touching anything visual.**

Images are referenced by absolute `raw.githubusercontent.com` URL inside a `<picture>` element,
because GitHub strips inline SVG out of Markdown and relative paths do not resolve on the profile
page.

Changing a template here changes it for every repository at once. Check the forms still render —
a malformed `.yml` fails silently and the form simply stops appearing.
