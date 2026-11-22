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

| | |
|---|---|
| `logo/logo.svg` | The logo: the coffee ring in ink on its own kraft paper, square. |
| `logo/logo-mono.svg`, `logo/mark-ring.svg` | The ring alone, one path, `currentColor`. |
| `logo/avatar-310.png` | The organisation avatar. Upload this file. |

**The logo is the coffee ring, and it is traced rather than drawn.** It is cut out of the style
master in the playbook by `brand/ring.py`, which means the outline is a real stain's outline,
with its real flecks and its real breaks. It is never a circle: a stain's whole content is that
it is irregular, and a perfectly round version of it was built once and rejected by two readers
in the same words.

**It carries its own paper on purpose.** A bare stain-coloured ring on transparency sits on
whatever the platform puts behind it, and on a dark tab it disappears. Stain on kraft measures a
contrast of 2.54, the lowest pairing in the kit; ink on kraft measures 7.01 and holds at 16 px.
So the small mark is drawn in ink, not in stain. It is the same ring: at a size where the
stain's colour cannot be read, the colour gives way and the shape does not.

**No corner radius.** A sheet of paper has corners. The old logo was an amber rounded square
with a white outlined cup in it, `rx="40"` on a 200×200 viewBox; that cup was rejected on
21 November and the palette variants, the second mark and both avatar sizes went with it.

**The avatar is 310 px square, and that is not an oversight.** It is cut from the master at 1:1
and the master has no more of it. Resampled to 512 its paper fibre measures 1.257 against the
plates' own range of 1.759 to 2.271, which is to say the fibre is gone and what is left is a
smooth brown disc. Upscaling it would be inventing paper, so it ships at the size it exists at.

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
