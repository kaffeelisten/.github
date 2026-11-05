# Kaffeelisten — brand

The brand layer: the logo, the marks, the palettes, the voice, and the rules for using them.
Canonical for the whole organisation.

**This is not the design system.** Component specs, spacing, type scale and semantic tokens live
in the product repository: [`docs/design-system.md`](https://github.com/kaffeelisten/kaffeelisten/blob/main/docs/design-system.md)
and the creative brief behind them in
[`docs/design-foundation.md`](https://github.com/kaffeelisten/kaffeelisten/blob/main/docs/design-foundation.md).
Everything here is derived from those files and from the app's own
`apps/web/src/index.css` and `apps/web/src/lib/palettes.ts`. **If the two ever disagree, the
product repository wins** — it is what actually renders.

**This is also not Alex's personal brand.** The one-line pen illustrations in
`dotPrivate/LINKEDIN/media` are his portfolio hand, used across all of his projects. Kaffeelisten
is a product with its own mark and its own palette. Do not mix them: a Kaffeelisten asset drawn in
the portfolio style is a portfolio asset, not a Kaffeelisten one.

---

## The mark

A **cappuccino cup with three steam curls**, drawn as a single-weight line. It is the same path
data everywhere — the app component, the favicon, the logo, this folder — so the tab icon, the
sidebar and the social card are literally the same drawing.

| File | What it is |
|---|---|
| `logo/logo.svg` | **The logo.** Amber rounded square, white mark. The default. |
| `logo/mark-cappuccino.svg` | The mark alone, `currentColor`. Use inside the product. |
| `logo/mark-deathstar.svg` | The alternate mark, `currentColor`. Imperium palette only. |
| `logo/logo-mono.svg` | Single colour, outlined square. For one-colour printing and stamps. |
| `logo/logo-itc1.svg`, `logo-wald.svg`, `logo-imperium.svg` | Palette variants. |
| `logo/avatar-512.png` | 512×512 raster. The organisation avatar. |
| `illustrations/tally-to-tablet.svg` | **The brand illustration.** The paper list and the tablet that replaces it. |
| `social/social-preview.png`, `social-preview-dark.png` | 1280×640, GitHub's 2:1 social preview. |

**The square is `rx="40"` on a 200×200 viewBox** — a 20% corner radius. Keep that ratio at every
size; a square scaled with the wrong radius reads as a different logo.

**The mark is `stroke-width="3.5"` inside the logo square and `2` standalone** (the standalone
version sits on a 200×160 viewBox, so the apparent weight matches).

### Using it

- **Clear space:** at least 10% of the logo's width on every side. Nothing else inside that.
- **Minimum size:** 24px for the logo square. Below that use the mark alone, without the square.
- **The square is `currentColor` in the app** (`Logo.tsx`), so it follows the active accent. In a
  static asset, pick the matching file above rather than recolouring by hand.
- **The mark stays white on the square**, in every palette. It is the one colour that never
  changes, because white is what guarantees contrast against any accent.

### Never

- Re-draw, re-trace or "clean up" the paths. There is one source; copy it.
- Put the mark on a photograph, a gradient or a busy background.
- Rotate, skew, add a shadow, outline, bevel or glow.
- Change the stroke weight to make it "lighter" at small sizes. Use the mark alone instead.
- Pair it with an emoji. The product uses none, anywhere.
- Use the Death Star mark outside the Imperium palette. It is an in-joke for one deployment, not
  a second logo.

---

## Colour

**Light mode is the primitive palette; dark mode overrides it.** Both are defined once, in
`apps/web/src/index.css`, as channel triplets on `:root` and `[data-mode='dark']`.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | `#FAFAF9` | `#1C1917` | Page background |
| `--surface` | `#FFFFFF` | `#292524` | Card, modal |
| `--surface-2` | `#F5F5F4` | `#33302E` | Input, subtle fill |
| `--border` | `#E7E5E4` | `#44403C` | Borders, dividers |
| `--border-strong` | `#D6D3D1` | `#57534E` | Stronger border |
| `--fg` | `#1C1917` | `#F5F5F4` | Primary text |
| `--fg-muted` | `#57534E` | `#A8A29E` | Secondary text |
| `--fg-subtle` | `#A8A29E` | `#78716C` | Placeholder |
| `--accent` | `#D97706` | `#F59E0B` | Brand accent |
| `--success` | `#16A34A` | `#4ADE80` | Success |
| `--error` | `#DC2626` | `#F87171` | Error |
| `--info` | `#2563EB` | `#60A5FA` | Info, links |

The palette is **stone plus amber**: a warm neutral grey, not a blue-grey. That single choice is
most of why the product feels like a calm tool rather than a dashboard.

**In the product, always use the semantic Tailwind classes** — `bg-bg`, `text-fg`, `bg-accent` —
never `stone-*` or `amber-*` literals, which do not adapt to dark mode or to a brand palette.

### Brand palettes

A palette rebrands the **accent only**. Surface and text tokens keep their defaults, so contrast
is guaranteed whatever the accent. Defined in `apps/web/src/lib/palettes.ts`.

| Palette | Light accent | Dark accent | Mark | Why it exists |
|---|---|---|---|---|
| **Standard (Amber)** | `#D97706` | `#F59E0B` | cappuccino | The default. Coffee warmth. |
| **ITC1** | `#018FC2` | `#34B7E6` | cappuccino | The campus's own blue, for their instance. |
| **Wald** | `#4D7C0F` | `#84CC16` | cappuccino | Bavarian Wald green. |
| **Imperium (Death Star)** | `#475569` | `#64748B` | deathstar | Imperial steel, for the Death Star cafeteria. |

Plus three **custom slots** editable from Settings, stored in `app_theme.custom`. A custom palette
is one accent hex per mode; `accent-hover` and `accent-subtle` are derived by mixing, so a single
colour is always enough.

**Amber is the brand. A palette is a guest.** Anything outside a specific deployment — this
organisation, the site, a deck, a document — uses Standard.

---

## Type

**Inter** (400, 500, 600, 700) for everything; **JetBrains Mono** (500, 600) for figures,
identifiers and code. Loaded from Google Fonts in `apps/web/src/index.css`.

Semantic classes `.k-display`, `.k-h1`…`.k-h3`, `.k-body`, `.k-caption`, `.k-eyebrow`, `.k-label`,
`.k-mono` are defined in `.design-sync/tokens/colors_and_type.css`. Use them rather than ad-hoc
sizes.

For brand assets: headline Inter 700 with `-0.025em` tracking; eyebrows Inter 600 at 16px with
`+0.16em` tracking, in the accent colour, uppercase.

---

## Voice

Taken from the design foundation, and it applies to assets as much as to UI.

- **German first.** The product's users are on a German campus. English is for developer-facing
  surfaces — this file, code comments, the organisation profile, anything aimed at contributors.
- **Professional, direct, warm, concise.** A calm tool, not a startup demo and not a kiosk.
- **No emojis.** Anywhere. Not in the UI, not in a README, not in a commit message.
- **No lorem ipsum.** Realistic German copy, always, even in a mock-up.
- **No marketing register.** "Die Kaffeeliste – ohne Papier." is the tone. "Revolutionising
  workplace beverage management" is not.

Lines that are approved and in use: *Die Kaffeeliste – ohne Papier.* · *Tablet statt Strichliste* ·
*Monatsbericht automatisch* · *Kein Login*.

---

## Illustration

**The brand is a vector line system, not a picture library.** Everything is drawn from the same
construction, so the logo, a 24px icon and a full illustration read as one hand:

```
fill="none"  stroke="currentColor"  stroke-linecap="round"  stroke-linejoin="round"
```

| Scale | viewBox | stroke-width |
|---|---|---|
| Icon | `0 0 24 24` | `1.5` |
| Illustration | `0 0 200 N` | `2` |
| Logo mark, inside the square | `0 0 200 200` | `3.5` |

The icon set lives in `apps/web/public/assets/icons/` (27 icons) and the app's illustrations in
`apps/web/public/assets/illustrations/` — `beans-trio`, `campus-skyline`, `cappuccino-white`,
`empty-cup`, `pine-silhouette`. The brand illustration here is built to the same rules.

**`currentColor` is the point.** An illustration inherits the text colour of wherever it sits, so
one file works in light mode, dark mode, at the accent colour and in muted grey. An `<img>` of the
same SVG cannot do this — inline it, or set `color` on a wrapper.

Coffee motifs as playful detail; Bavarian Wald as atmosphere, abstract rather than touristic. No
rustic textures, no photographic imagery, no stock illustration.

An illustration never carries text. Every name and number stays real text, so it stays
translatable, selectable and accessible.

### Adding one

Author the SVG by hand against the table above, from simple primitives — `path`, `rect`,
`ellipse`, `circle` — on a round-numbered grid. Then look at it at **three sizes and two themes**
before committing; `brand/render.mjs` is a working example of how to proof it.

**Do not generate illustrations for this system with an image model.** A raster cannot inherit
`currentColor`, cannot scale to a 24px icon, and will not hold a 2px stroke — in practice the
model returns filled flat shapes, which is a different language from this one. Image generation
is the right tool for a portfolio banner or a textured scene; it is the wrong tool for extending a
line system that has to theme and scale.

---

## Rebuilding the raster assets

The PNGs are generated, not hand-made. Both come from the SVGs in `logo/`, rendered with the
product repo's own `puppeteer-core` and local Chrome — the same mechanism the app uses for PDFs,
so no new dependency is introduced.

The render script is kept with the brand assets it produces; it takes this folder as its argument
and writes `logo/avatar-512.png` and both `social/social-preview*.png`. Colours in it are copied
from the token table above, which is copied from `index.css` — so when the tokens change, the
assets are re-rendered rather than edited.

**Where the generated assets are used**, and both are **web-only uploads**:

| Asset | Where |
|---|---|
| `logo/avatar-512.png` | Organisation avatar — Settings, no API exists for it |
| `social/social-preview.png` | Each repository's social preview — Settings → Social preview |

### Metadata

Raster brand assets ship **pixels only** — no EXIF, no XMP, no C2PA `caBX` chunk — the same rule
`duckwalk/docs/brand.md` sets for shipped binaries. These are generated from our own SVG source by
a local headless browser, so there is no provenance claim to preserve in the first place.

That rule is **scoped to assets that ship inside a repository.** It is the opposite of the rule for
anything uploaded to a social platform, where `LINKEDIN/media/README.md` requires Content
Credentials to be left intact. Do not carry this rule across to that use.

---

## Known inconsistency

**`apps/web/public/favicon.svg` and `docs/assets/favicon.svg` are not the logo.** They are a plain
white rounded square with an amber border and no cup, which matches nothing else here. The app
replaces the tab icon at runtime with a correct accent-coloured mark (`applyBrandFavicon` in
`theme.tsx`), so this only shows before the app boots and wherever the static file is served
directly. It should be replaced with `logo/logo.svg`.
