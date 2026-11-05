# Kaffeelisten — brand

The brand kit: the wordmark, the logo, the palette, the visual world, and the system that
generates it. Canonical for the whole organisation.

**This is not the design system.** Component specs, spacing, the type scale and the semantic
tokens live in the product repository —
[`docs/design-system.md`](https://github.com/kaffeelisten/kaffeelisten/blob/main/docs/design-system.md)
and the brief behind them in `docs/design-foundation.md`. Colours here are copied from the app's
own `index.css`. **If the two disagree, the product repository wins** — it is what actually
renders.

**It is also not Alex's personal brand.** The thin pen-line illustrations in
`dotPrivate/LINKEDIN/media` are his portfolio hand, used across fourteen projects. Kaffeelisten is
a separate organisation with its own identity. Do not mix them.

---

## The wordmark

**Kaffee**listen — one unbroken word, the first six letters in near-black ink, the last six in the
brand amber.

The name is a fused compound, and colouring the seam is the whole idea: it makes the pun legible
in a glance, and it puts the brand amber *inside* the logotype rather than in the background. That
means the colour travels — onto white paper, a shirt, an invoice footer, a favicon — instead of
depending on whatever art sits behind it. It is also what survives a crop: cut the wordmark in
half and the amber still identifies you.

Beneath it, smaller and lighter: *Die Kaffeeliste – ohne Papier.*

**On tall or narrow surfaces it stacks**, left-aligned, tight leading:

```
Kaffee      ← near-black
listen      ← amber
```

Two lines, still one word. Use the stacked form wherever a single line would have to shrink to
fit — stories, portrait posts, anything roughly 1:1 or taller.

**Never** break the word with a space or a hyphen, recolour either half, set it in a light weight,
or letterspace it loosely. It is one word, heavy, tight.

## The logo

The amber rounded square with the white line cappuccino, unchanged. It is the app's mark, the
favicon and the organisation avatar — the small-size form of the identity, where a wordmark cannot
read.

| File | |
|---|---|
| `logo/logo.svg` | The logo. Amber square, white mark. |
| `logo/logo-itc1.svg`, `logo-wald.svg`, `logo-imperium.svg` | Palette variants, matching the app's brand palettes. |
| `logo/logo-mono.svg` | Single colour, outlined square, for one-colour printing. |
| `logo/mark-cappuccino.svg`, `mark-deathstar.svg` | The marks alone, `currentColor`. |
| `logo/avatar-512.png` | 512×512 raster. The organisation avatar. |

The square is `rx="40"` on a 200×200 viewBox — a 20% corner radius. Keep that ratio at every size.
The mark stays white on the square in every palette; white is what guarantees contrast against any
accent.

---

## Colour

Three inks. That restraint is most of the identity.

| | Hex | |
|---|---|---|
| **Paper** | `#FAFAF9` | The ground. Warm off-white, never a cool grey. |
| **Ink** | `#1C1917` | Type and dark planes. Warm near-black, never pure black. |
| **Amber** | `#D97706` | The single accent. `#F59E0B` in dark contexts. |

Supporting stone tones for secondary text (`#57534E`) and borders (`#E7E5E4`) come from the design
system. Nothing else — no blue, no green, no second accent. A generated plate that arrives with a
stray hue gets regenerated, not accepted.

The app additionally supports brand palettes (ITC1 blue, Wald green, Imperium steel) which
rebrand the **accent only**, inside the product. Brand assets outside the product always use
amber.

## Type

**Inter** — 800 for the wordmark with `-0.035em` tracking, 400 for the tagline. **JetBrains Mono**
for figures and identifiers. Both from the design system.

---

## The visual world

**Flat cut-paper collage.** Shapes cut and torn from textured paper and laid flat: clean geometric
planes, hard origami fold lines, deliberately torn deckled edges, a small square note, a coffee
ring printed slightly off-register, and the cup rendered as cut paper. Visible grain inside every
shape. Screen-printed, risograph feel.

It ties directly to the thing the product replaces — a sheet of paper by the machine — and it is
distinctive rather than generic. **Not photography.** No depth of field, no studio lighting, no
cast shadows, no 3D, no desk scenes, no props, no hands.

---

## How assets are made

```
tools/prompts.json  ──►  gen_texture.py  ──►  out/      candidates, gitignored
                                               │
                                        you pick one
                                               ▼
                                            plates/     the chosen plate per format
                                               │
            tools/surfaces.json  ──►  surfaces.py  ──►  assets/   every shipped surface
```

**1 · Generate plates.** `gpt-image-2.5-sunburst`, through the images *edits* endpoint, always
grounded in the logo as a reference — never a text prompt alone.

```bash
export OPENAI_API_KEY=...          # dotPrivate/.env
python -I tools/gen_texture.py <format> [theme] [n] [round]
```

Formats are composition briefs, not just sizes. The API only returns 1:1, 3:2 and 2:3, so each
one describes **where in the frame the composition must sit** for its family of crops:

| Format | Its own composition | Feeds |
|---|---|---|
| `banner` | Torn vertical edge, calm paper left, dense amber field right | social preview, og, LinkedIn post, print |
| `wide3` | Panoramic counter, layered bands running edge to edge | README strip |
| `xheader` | One huge amber field, cup reversed out, high contrast | X header |
| `emailheader` | Type-led and editorial, one amber diagonal, a stack of notes | newsletter |
| `ultrawide` | A frieze: elements marching across a shallow centre strip | LinkedIn cover, 5.9:1 |
| `square` | Centred poster, stacked lockup, cup as hero | square posts |
| `portrait` | A tall stack read top to bottom, side margins kept clear | stories, 9:16 |

**Each one is a different picture, not the same picture resized.** That is the difference between
a kit that feels designed and one that feels templated — and it is the thing that went wrong the
first time, when every format was briefed toward empty margins and arrived sparse and weak.
Density, layering and balance are what make these read as branding.

Candidates land in `out/`, metadata already stripped.

**2 · Choose.** Look at the candidates and copy the one you want to `plates/<format>.png`.
Nothing picks for you, and that is deliberate.

**3 · Cut every surface.**

```bash
python -I tools/surfaces.py [theme]
```

### Generate the shape; do not squeeze the art

The image API only produces 1:1, 3:2 and 2:3. Everything else is a crop — and a bad crop is the
quickest way to ruin a good plate.

The LinkedIn cover is 5.9:1. Cropping the normal wide plate to it ate the composition and clipped
the steam. Fitting it instead, with paper margins, shrank the art to a stamp in a dead field. The
answer was neither: a dedicated **`ultrawide`** format whose brief puts the whole composition
inside the middle quarter of the frame, so the crop is full-bleed and nothing is squeezed.

**The rule: when a surface does not fit, change the generation brief, not the crop.** That is why
`wide3` and `ultrawide` exist as separate formats rather than as different crops of one plate.

`surfaces.py` has two modes. **`cover`** fills the frame and trims the rest; it is the default.
**`fit`** scales the whole composition down and pads with the plate's own paper — only acceptable
when the surface ratio is *close* to the plate's, where the padding reads as a deliberate margin.
At an extreme gap it shrinks the art to a stamp in a dead field, which is worse than any crop.

The same lesson applied vertically: a 9:16 story cut from a full-width portrait plate clipped the
wordmark at both edges. The fix was not a different crop but a brief that keeps the lettering
inside the central three quarters of the width, plus the stacked lockup so it does not need the
full width in the first place.

---

## The surfaces

Every one is cut from a plate by `surfaces.py`, listed with its use in `tools/surfaces.json`.

| Asset | Size | Plate | Where it goes |
|---|---|---|---|
| `github-social.jpg` | 1280×640 | banner | Repository social preview. Under GitHub's 1 MB cap. |
| `og.jpg` | 1200×630 | banner | Open Graph, link previews in chat and search. |
| `readme-banner.jpg` | 1536×512 | wide | The strip at the top of a README. |
| `linkedin-banner.jpg` | 1128×191 | ultrawide | LinkedIn company page cover. |
| `linkedin-post.jpg` | 1200×627 | banner | LinkedIn link and image posts. |
| `x-header.jpg` | 1500×500 | wide | X profile header. |
| `instagram-square.jpg` | 1080×1080 | square | Square social posts. |
| `story.jpg` | 1080×1920 | portrait | Stories and reels covers. |
| `email-header.jpg` | 1200×400 | ultrawide | Newsletter header. |
| `print-a4-landscape.png` | 3508×2480 | banner | A4 at 300 dpi. Check it at size before printing. |

JPEG wherever a platform caps the file size or the asset is a photograph-like texture; PNG for
print. `surfaces.py` steps the JPEG quality down until it is under 1 MB.

**Proof the round before shipping it:**

```bash
cd <product repo> && cp <brand>/tools/contact_sheet.mjs ./sheet.tmp.mjs
CHROMIUM_PATH=... node ./sheet.tmp.mjs <brand> [theme] && rm ./sheet.tmp.mjs
```

It writes `contact-sheet.png` — every surface at its real ratio with its size and its use, which
is how a bad crop gets caught before it reaches a profile page.

## Themed variants

Seasonal sets need no new code. Add a theme to `themes` in `prompts.json` — `halloween`,
`christmas`, `easter` and `wald` are already written — then:

```bash
python -I tools/gen_texture.py banner halloween 3 h1
cp out/banner-halloween-h1-2.png plates/banner-halloween.png
python -I tools/surfaces.py halloween
```

Every surface comes out as `<name>-halloween.<ext>` beside the defaults. A theme modifies the
*world* — one cut-paper crescent, a folded star — and never the wordmark, the logo or the three
inks. The identity stays constant; only the season changes.

---

## Metadata

Everything that ships is rebuilt **from pixels only** — no EXIF, no XMP, no C2PA `caBX` chunk.
`gen_texture.py` strips each candidate on arrival and `surfaces.py` strips again on the way out.
This is the same rule `duckwalk/docs/brand.md` sets for shipped binaries.

It is scoped to assets that ship inside a repository. It is **the opposite** of the rule for
uploads to a social platform, where `LINKEDIN/media/README.md` requires Content Credentials to be
left intact. Do not carry this rule across to that use.

## Rules

- **No generated image without a real reference.** The logo is always passed as a reference.
- **Check the spelling of every generated plate.** Image models misspell; "Kaffeelisten" is one
  word with two f's and two e's in the middle.
- **Three inks.** Regenerate rather than accept a stray hue.
- **No emojis**, anywhere, in any asset or any copy.
- **German-first copy** on brand assets; English for developer-facing surfaces.
- **No real member names** in any asset, ever — the repositories are public.

## Known inconsistency

`apps/web/public/favicon.svg` and `docs/assets/favicon.svg` are a plain bordered square with no
cup, matching nothing else here. The app replaces the tab icon at runtime, so it only shows before
boot. It should be replaced with `logo/logo.svg`.
