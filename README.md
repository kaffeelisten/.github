# .github

Organisation-wide defaults for [`kaffeelisten`](https://github.com/kaffeelisten). This repository
holds no application code.

| Path | What it does |
|---|---|
| `profile/README.md` | The organisation's public profile page. |
| `brand/BRAND.md` | **The brand book** — logo, marks, palettes, type, voice, usage rules. |
| `brand/logo/` | Logo and mark SVGs, palette variants, and the 512&times;512 avatar. |
| `brand/social/` | 1280&times;640 social previews, light and dark. |
| `brand/render.mjs` | Regenerates the PNGs from the SVGs. |
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
