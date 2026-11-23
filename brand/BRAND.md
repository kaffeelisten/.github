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
| `logo/mark.svg` | The logo. Full colour, with the paper grain as real geometry. |
| `logo/mark-one-ink.svg` | One ink, `currentColor`. Stitch, vinyl, stamp, single-colour press. |
| `logo/mark-reverse.svg` | Knocked out of a dark plane. |
| `logo/mark-small.svg` | **The cup alone.** Below about 32 px. |
| `logo/avatar-1024.png`, `-512.png` | The organisation avatar, rendered from `mark.svg`. Upload the 1024. |

**Use `mark-small.svg` below 32 px and never shrink `mark.svg` into that slot.** Put beside the
old badge at 16 and 24 px the full mark lost outright: it goes to mass while a filled square stays
legible. The crescent of torn paper and the leaves are what make it a collage and they are also
what fills in first, so the small cut drops them and keeps the cup.

**The source is `brand/vector.py` in the playbook**, which draws these from the approved artwork
and measures them. Do not edit an SVG here by hand; change the source and rebuild, or the four
cuts drift apart. What the gate says the cuts can make: screen print from 33 mm, embroidery from
67 mm, cut vinyl from 53 mm, and the small cut from 20 px.

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
