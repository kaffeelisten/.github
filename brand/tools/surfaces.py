"""Cut every brand surface from the chosen plates.

    python -I surfaces.py [theme]

Reads surfaces.json, takes each surface's source plate from plates/<format>.png
(or plates/<format>-<theme>.png), crops it to the surface's aspect around the
surface's focus, resizes, and writes assets/<name>.<ext>.

Every file is rebuilt from pixels only, so no C2PA, EXIF or text chunk ships.

Choosing a plate is a human step: look at the candidates in out/, then copy the
one you want to plates/<format>.png. Nothing here picks for you.
"""
import json
import pathlib
import sys

from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
BRAND = HERE.parent
CFG = json.loads((HERE / "surfaces.json").read_text(encoding="utf-8"))["surfaces"]
PLATES = BRAND / "plates"
ASSETS = BRAND / "assets"

JPEG_LIMIT_KB = 1024


def pixels_only(im: Image.Image) -> Image.Image:
    clean = Image.new("RGB", im.size)
    clean.putdata(list(im.convert("RGB").getdata()))
    return clean


def paper(im: Image.Image) -> tuple:
    """The plate's own paper tone, averaged from its four corners."""
    w, h = im.size
    pts = [(2, 2), (w - 3, 2), (2, h - 3), (w - 3, h - 3)]
    px = [im.getpixel(p) for p in pts]
    return tuple(sum(c[i] for c in px) // len(px) for i in range(3))


def crop_to(im: Image.Image, ratio: float, focus: float) -> Image.Image:
    """Cover: fill the frame, trimming whatever does not fit."""
    w, h = im.size
    if w / h > ratio:                      # too wide: trim the sides, keep centre
        tw = int(round(h * ratio))
        left = (w - tw) // 2
        return im.crop((left, 0, left + tw, h))
    th = int(round(w / ratio))             # too tall: trim top/bottom around focus
    top = int(round((h - th) * focus))
    top = max(0, min(h - th, top))
    return im.crop((0, top, w, top + th))


def fit_to(im: Image.Image, w: int, h: int) -> Image.Image:
    """Fit: keep the whole composition, pad with the plate's own paper.

    Used where the surface is a far more extreme ratio than anything the image
    API can generate. Cropping to those shapes eats the artwork, so the band is
    scaled down whole and the margins are filled with its paper tone, which
    reads as a deliberate margin rather than a bad crop.
    """
    scale = min(w / im.width, h / im.height)
    inner = im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))), Image.LANCZOS)
    canvas = Image.new("RGB", (w, h), paper(im))
    canvas.paste(inner, ((w - inner.width) // 2, (h - inner.height) // 2))
    return canvas


def main() -> int:
    theme = sys.argv[1] if len(sys.argv) > 1 else "default"
    suffix = "" if theme == "default" else f"-{theme}"
    ASSETS.mkdir(exist_ok=True)

    missing, written = [], 0
    for name, s in CFG.items():
        plate = PLATES / f"{s['plate']}{suffix}.png"
        if not plate.is_file():
            missing.append(f"{name}: needs {plate.relative_to(BRAND)}")
            continue
        im = Image.open(plate).convert("RGB")
        if s.get("mode", "cover") == "fit":
            im = pixels_only(fit_to(im, s["w"], s["h"]))
        else:
            im = crop_to(im, s["w"] / s["h"], s.get("focus", 0.5))
            im = pixels_only(im.resize((s["w"], s["h"]), Image.LANCZOS))

        out = ASSETS / f"{name}{suffix}.{s['format']}"
        if s["format"] == "jpg":
            q = 90
            while True:
                im.save(out, "JPEG", quality=q, optimize=True, progressive=True, subsampling=0)
                if out.stat().st_size // 1024 <= JPEG_LIMIT_KB or q <= 60:
                    break
                q -= 6
        else:
            im.save(out, optimize=True)

        kb = out.stat().st_size // 1024
        # Only the platform-capped surfaces care about the size; a print file is meant to be big.
        flag = "  OVER 1 MB" if kb > JPEG_LIMIT_KB and s["format"] == "jpg" else ""
        print(f"{out.name:30} {s['w']:>5}x{s['h']:<5} {kb:5d} KB{flag}")
        written += 1

    for m in missing:
        print(f"skipped  {m}")
    print(f"\n{written} surfaces written to {ASSETS.relative_to(BRAND.parent)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
