"""Generate Kaffeelisten texture plates with gpt-image-2.5-sunburst.

    python -I gen_texture.py <format> [theme] [n] [round]

        format : banner | square | portrait      (prompts.json → formats)
        theme  : default | halloween | christmas | easter | wald
        n      : how many candidates           (default 3)
        round  : label for this batch          (default r1)

Writes out/<format>-<theme>-<round>-<i>.png, each rebuilt from pixels only so
no C2PA, EXIF or text chunk ever ships.

The model draws the WORLD only — paper, folds, stains, light. It never draws the
logo and never draws lettering; those are composited afterwards by compose.mjs
from the real SVG and real Inter, so brand fidelity does not depend on a model.

Needs OPENAI_API_KEY (workspace .env.local at the umbrella root, or dotPrivate/.env)
and curl. The key is passed on stdin, never as an argv entry.
"""
import base64
import json
import os
import pathlib
import subprocess
import sys

from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
CFG = json.loads((HERE / "prompts.json").read_text(encoding="utf-8"))
LOGO_REF = HERE.parent / "logo" / "avatar-512.png"
OUT = HERE.parent / "out"


def build_prompt(fmt: str, theme: str) -> str:
    f = CFG["formats"][fmt]
    parts = []
    # Lettering leads: a long "no text" tail at the end suppresses it entirely.
    if f.get("lettered", True):
        key = "lettering_stacked" if f.get("stacked") else "lettering"
        if CFG.get(key):
            parts.append(CFG[key])
    parts += [CFG["base"], f["composition"], CFG["palette_rule"]]
    if CFG["themes"].get(theme):
        parts.append(CFG["themes"][theme])
    parts.append(
        "The FIRST reference image is the brand logo: match its exact amber and its "
        "warm off-white, but do NOT redraw the logo itself."
    )
    parts.append(CFG["negative"])
    return " ".join(p for p in parts if p)


def strip_metadata(path: pathlib.Path) -> None:
    im = Image.open(path)
    clean = Image.new("RGB", im.size)
    clean.putdata(list(im.convert("RGB").getdata()))
    clean.save(path, optimize=True)


def main() -> int:
    fmt = sys.argv[1] if len(sys.argv) > 1 else "banner"
    theme = sys.argv[2] if len(sys.argv) > 2 else "default"
    n = sys.argv[3] if len(sys.argv) > 3 else "3"
    rnd = sys.argv[4] if len(sys.argv) > 4 else "r1"

    if fmt not in CFG["formats"]:
        sys.exit(f"unknown format {fmt!r}; have {', '.join(CFG['formats'])}")
    if theme not in CFG["themes"]:
        sys.exit(f"unknown theme {theme!r}; have {', '.join(CFG['themes'])}")
    if not LOGO_REF.is_file():
        sys.exit(f"missing logo reference: {LOGO_REF}")

    cmd = [
        "curl", "-sS", "-K", "-", "https://api.openai.com/v1/images/edits",
        "-F", f"model={CFG['model']}",
        "-F", f"prompt={build_prompt(fmt, theme)}",
        "-F", f"size={CFG['formats'][fmt]['size']}",
        "-F", "quality=high", "-F", f"n={n}",
        "-F", f"image[]=@{LOGO_REF}",
    ]
    auth = 'header = "Authorization: Bearer ' + os.environ["OPENAI_API_KEY"] + '"' + chr(10)
    res = subprocess.run(cmd, input=auth, capture_output=True, text=True, timeout=900)
    if res.returncode != 0:
        sys.exit(f"curl failed: {res.stderr[:400]}")
    data = json.loads(res.stdout)
    if "error" in data:
        sys.exit(f"api: {data['error'].get('message')}")

    OUT.mkdir(exist_ok=True)
    for i, item in enumerate(data["data"], 1):
        p = OUT / f"{fmt}-{theme}-{rnd}-{i}.png"
        p.write_bytes(base64.b64decode(item["b64_json"]))
        strip_metadata(p)
        print(f"{p.name}  {p.stat().st_size // 1024} KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
