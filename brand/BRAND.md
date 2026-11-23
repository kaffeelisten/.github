# Kaffeelisten – brand

The essentials, and where the full book lives.

**This folder holds finished assets only.** The brand book, the vocabulary and the generator are
in the private `kaffeelisten/playbook` repository under `06-brand/` and `brand/`. Nothing here is
authored by hand.

---

## The wordmark

**Kaffee**listen – one unbroken word, `Kaffee` in ink and `listen` in amber, the colour changing
mid-word with no gap. Beneath it: *Die Kaffeeliste – ohne Papier.*

It stacks on two lines for tall or narrow surfaces. Never break the word, recolour either half,
set it light, or letterspace it loosely.

## The logo

**The logo is the torn-paper cup.** It is one drawing in four cuts, and there is no longer a
separate badge: the amber rounded square with the white line cappuccino was rejected on
21 November 2026 and its files are gone from this folder.

| | |
|---|---|
**Three levels of reduction, each in two inks.**

| level | file | what it keeps | reads down to |
|---|---|---|---|
| 1 | `logo/mark-cup.svg` | the cup and its steam | 24 px |
| 2 | `logo/mark-mono.svg` | the cup, the leaves, the torn crescent | 32 px |
| 3 | `logo/mark.svg` | everything, in colour, with the paper | 96 px |

| | |
|---|---|
| `logo/mark-cup-light.svg`, `mark-mono-light.svg` | the same geometry with the ink baked light |
| `logo/avatar-1024.png`, `-512.png` | The organisation avatar, the approved artwork. Upload the 1024. |

Levels one and two are drawn in `currentColor`, so a page sets the ink and one file serves both.
The `-light` files exist for an `<img>` tag and a printer, which have no colour to inherit, and
they are generated from the same geometry so they cannot drift. **Level three needs no light
version**: it carries its own sheet of paper.

### Which ink on which ground

The light cut is not a black-background cut. Two of this brand's own grounds are light enough
that a paper-coloured mark vanishes on them, so the choice is arithmetic:

| ground | hex | dark ink | light ink | use |
|---|---|---|---|---|
| paper | `#FAFAF9` | 12.75 | 1.0 | **dark** |
| milk | `#F5EFE6` | 11.65 | 1.09 | **dark** |
| kraft | `#C8A882` | 5.95 | 2.14 | **dark** |
| amber | `#D97706` | 4.18 | 3.05 | **dark** |
| stain | `#A1662F` | 2.83 | 4.51 | **light** |
| wald | `#4D7C0F` | 2.67 | 4.78 | **light** |
| espresso | `#4A2C17` | 1.06 | 12.08 | **light** |
| ink | `#1C1917` | 1.31 | 16.74 | **light** |

Computed by `python brand/vector.py grounds` in the playbook.

**The avatars are the approved artwork and are not re-rendered from the vector.** They were
overwritten with a re-render once and put back: the approved file is used precisely because
nothing was redrawn, so it cannot drift from what was approved.

**The source is `brand/vector.py` in the playbook**, which draws these from the approved artwork
and measures them. Do not edit an SVG here by hand; change the source and rebuild, or the four
cuts drift apart. What the gate says these can make: level two from 32 mm screen print, 63 mm
embroidery and 50 mm cut vinyl; level one from 18 mm, 37 mm and 29 mm.

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

**Inter** – 800 for the wordmark with tight tracking, 400 for the tagline. **JetBrains Mono** for
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
| `assets/x-header.jpg` | 1500×500. X / Twitter header; the bottom-left is kept calm for the profile picture. |
| `assets/story.jpg` | 1080×1920. Story; top and bottom kept clear for the platform's UI. |

Every file is rebuilt from pixels only – no EXIF, no XMP, no C2PA chunk.

## Using them

- **Do not edit these files.** They are regenerated from the playbook; a hand-edit is lost on the
  next run and drifts from the source.
- **Do not crop them** to fit a new surface. A composition briefed for one shape does not survive
  being cut to another; brief a new surface instead.
- **Do not recolour or recompose** the wordmark or the logo.
- Need a surface that is not here? It is briefed in the playbook as a new board.

## Not the design system

Component specs, spacing, the type scale and the semantic tokens live in the product repository –
`docs/design-system.md` and `docs/design-foundation.md`. The colours above are copied *from* the
app's `index.css`. Where the two disagree, the product repository wins.
