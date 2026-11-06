# Kaffeelisten — brand

The essentials, and where the full book lives.

**This folder holds finished assets only.** The brand book, the vocabulary and the generator are
in the private `kaffeelisten/playbook` repository under `06-brand/` and `brand/`. Nothing here is
authored by hand.

---

## The wordmark

**Kaffee**listen — one unbroken word, `Kaffee` in ink and `listen` in amber, the colour changing
mid-word with no gap. Beneath it: *Die Kaffeeliste – ohne Papier.*

It stacks on two lines for tall or narrow surfaces. Never break the word, recolour either half,
set it light, or letterspace it loosely.

## The logo

| | |
|---|---|
| `logo/logo.svg` | The logo — amber rounded square, white line cappuccino. |
| `logo/logo-itc1.svg`, `-wald.svg`, `-imperium.svg` | Palette variants. |
| `logo/logo-mono.svg` | Single colour, for one-colour printing. |
| `logo/mark-cappuccino.svg`, `mark-deathstar.svg` | The marks alone, `currentColor`. |
| `logo/avatar-512.png` | 512×512 raster. The organisation avatar. |

`rx="40"` on a 200×200 viewBox — a 20% corner radius, kept at every size. The mark stays white on
the square in every palette.

## Colour

Three inks appear in everything:

| | Hex | |
|---|---|---|
| Paper | `#FAFAF9` | The ground. Warm off-white, never a cool grey. |
| Ink | `#1C1917` | Type and dark planes. Warm near-black, never pure black. |
| Amber | `#D97706` | The single accent. |

At most one further ink may join them, never two. Coffee stains dry to `#A1662F` and are never
amber.

## Type

**Inter** — 800 for the wordmark with tight tracking, 400 for the tagline. **JetBrains Mono** for
figures and identifiers.

## The assets here

| | |
|---|---|
| `assets/readme-banner.jpg` | 1536×512. The README and profile header. |
| `assets/github-social.jpg` | 1280×640. Repository social preview, under GitHub's 1 MB cap. |
| `assets/og.jpg` | 1200×630. Open Graph and link previews. |
| `assets/linkedin-post.jpg` | 1200×627. |
| `assets/print-a4-portrait.png` | 2480×3508. A4 portrait at 300 dpi – the poster beside the machine. |
| `assets/instagram-square.jpg` | 1080×1080. Square post. |
| `assets/linkedin-banner.jpg` | 1128×191. LinkedIn company cover, cut from a 1536×512 plate briefed for its centre band. |
| `assets/email-header.jpg` | 1200×400. Email header. |

Every file is rebuilt from pixels only — no EXIF, no XMP, no C2PA chunk.

## Using them

- **Do not edit these files.** They are regenerated from the playbook; a hand-edit is lost on the
  next run and drifts from the source.
- **Do not crop them** to fit a new surface. A composition briefed for one shape does not survive
  being cut to another; brief a new surface instead.
- **Do not recolour or recompose** the wordmark or the logo.
- Need a surface that is not here? It is briefed in the playbook as a new board.

## Not the design system

Component specs, spacing, the type scale and the semantic tokens live in the product repository —
`docs/design-system.md` and `docs/design-foundation.md`. The colours above are copied *from* the
app's `index.css`. Where the two disagree, the product repository wins.
