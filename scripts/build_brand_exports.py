"""Deterministic brand exports for Jay Sample.

Source of truth: brand-source/jay-sample-logo-master-supplied.png (raster, RGBA,
supplied by client 2026-10-01). No vector master exists yet:
DATA BELUM ADA: original Jay Sample vector logo | Penyelesai: original AI/EPS/SVG
artwork from brand owner | Owner: BELUM DITENTUKAN

Rules (mirrors jerco-brand-assets discipline):
- Never redraw, recolor, stretch, or re-letter the logo. Only trim + scale down.
- Never upscale above the source optical width.
- Never wrap the raster inside an SVG and call it vector.
- Every export is recorded in public/brand/manifest.json with SHA-256.

Run: python3 scripts/build_brand_exports.py   (requires Pillow with WebP/AVIF)
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "brand-source" / "jay-sample-logo-master-supplied.png"
OUT_LOGO = ROOT / "public" / "brand" / "logo"
OUT_ICON = ROOT / "public" / "brand" / "icons"
MANIFEST = ROOT / "public" / "brand" / "manifest.json"
GEN_TS = ROOT / "src" / "data" / "generated" / "brand-manifest.ts"

# Pixels with alpha below this are anti-alias / edge noise (source has alpha<=11
# specks at x=0..3). Optical bounds ignore them.
OPTICAL_ALPHA_THRESHOLD = 8
LOGO_WIDTHS = [480, 800, 1200, 1600]
STAGE_BG = (5, 5, 5)  # matches --primitive-black-950 (#050505)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def optical_bbox(img: Image.Image) -> tuple[int, int, int, int]:
    alpha = img.getchannel("A")
    mask = alpha.point(lambda v: 255 if v >= OPTICAL_ALPHA_THRESHOLD else 0)
    bbox = mask.getbbox()
    if bbox is None:
        raise SystemExit("Logo has no visible pixels")
    return bbox


def fit(img: Image.Image, width: int) -> Image.Image:
    height = round(img.height * width / img.width)
    return img.resize((width, height), Image.Resampling.LANCZOS)


def stage(size: tuple[int, int], glow: bool = True) -> Image.Image:
    """Near-black stage with a soft neutral ambient light (no hue)."""
    w, h = size
    base = Image.new("RGB", size, STAGE_BG)
    if not glow:
        return base
    light = Image.new("L", size, 0)
    d = ImageDraw.Draw(light)
    rx, ry = int(w * 0.42), int(h * 0.38)
    d.ellipse((w // 2 - rx, h // 2 - ry, w // 2 + rx, h // 2 + ry), fill=34)
    light = light.filter(ImageFilter.GaussianBlur(radius=max(w, h) * 0.09))
    tint = Image.new("RGB", size, (235, 235, 235))
    return Image.composite(tint, base, light)


def place(canvas: Image.Image, logo: Image.Image, width_ratio: float) -> Image.Image:
    target_w = min(int(canvas.width * width_ratio), logo.width)
    sized = fit(logo, target_w)
    if sized.height > canvas.height * 0.8:
        target_h = int(canvas.height * 0.8)
        sized = logo.resize(
            (round(logo.width * target_h / logo.height), target_h), Image.Resampling.LANCZOS
        )
    out = canvas.convert("RGBA")
    x = (canvas.width - sized.width) // 2
    y = (canvas.height - sized.height) // 2
    out.alpha_composite(sized, (x, y))
    return out


def main() -> None:
    OUT_LOGO.mkdir(parents=True, exist_ok=True)
    OUT_ICON.mkdir(parents=True, exist_ok=True)
    GEN_TS.parent.mkdir(parents=True, exist_ok=True)

    src = Image.open(SRC).convert("RGBA")
    bbox = optical_bbox(src)
    trimmed = src.crop(bbox)
    entries: list[dict] = []

    def record(path: Path, role: str, status: str) -> None:
        with Image.open(path) as im:
            w, h = im.size
        entries.append(
            {
                "file": str(path.relative_to(ROOT / "public")).replace("\\", "/"),
                "role": role,
                "width": w,
                "height": h,
                "bytes": path.stat().st_size,
                "sha256": sha256(path),
                "status": status,
            }
        )

    # Primary logo (light-on-dark is the native artwork) — trimmed to optical bounds.
    for w in LOGO_WIDTHS:
        if w > trimmed.width:
            continue
        img = fit(trimmed, w)
        base = OUT_LOGO / f"jay-sample-logo-primary-{w}w"
        img.save(base.with_suffix(".png"), optimize=True)
        img.save(base.with_suffix(".webp"), quality=90, method=6)
        img.save(base.with_suffix(".avif"), quality=70)
        for ext in (".avif", ".webp", ".png"):
            record(base.with_suffix(ext), "logo-primary", "DATA FINAL (derived from supplied raster)")

    # Social avatar / app icons — interim: full logotype on stage square.
    # A dedicated monogram is NOT drawn here (would be a redesign).
    for size, name in [(512, "jay-sample-avatar-512.png"), (192, "jay-sample-icon-192.png"),
                       (180, "apple-touch-icon.png"), (48, "favicon-48.png"), (32, "favicon-32.png")]:
        sq = place(stage((size, size), glow=size >= 180), trimmed, 0.86)
        path = OUT_ICON / name
        sq.convert("RGB").save(path, optimize=True)
        record(path, "icon-interim", "ASSUMPTION (interim; monogram DATA BELUM ADA)")

    # OpenGraph 1200x630
    og = place(stage((1200, 630)), trimmed, 0.62)
    og_path = ROOT / "public" / "brand" / "jay-sample-og.jpg"
    og.convert("RGB").save(og_path, quality=88, optimize=True, progressive=True)
    record(og_path, "opengraph", "ASSUMPTION (composition pending owner approval)")

    manifest = {
        "source": {
            "file": str(SRC.relative_to(ROOT)),
            "sha256": sha256(SRC),
            "size": list(src.size),
            "mode": "RGBA raster",
            "vector_master": "DATA BELUM ADA",
        },
        "optical_bounds": {
            "alpha_threshold": OPTICAL_ALPHA_THRESHOLD,
            "bbox": list(bbox),
            "width": trimmed.width,
            "height": trimmed.height,
            "aspect_ratio": round(trimmed.width / trimmed.height, 4),
        },
        "exports": entries,
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

    widths = [w for w in LOGO_WIDTHS if w <= trimmed.width]
    GEN_TS.write_text(
        "// GENERATED by scripts/build_brand_exports.py — do not edit by hand.\n"
        f"export const LOGO_OPTICAL = {{ width: {trimmed.width}, height: {trimmed.height} }} as const;\n"
        f"export const LOGO_WIDTHS = {json.dumps(widths)} as const;\n"
        "export const LOGO_BASE = '/brand/logo/jay-sample-logo-primary';\n",
        encoding="utf-8",
    )
    print(f"optical bbox {bbox} -> {trimmed.size}, {len(entries)} exports")


if __name__ == "__main__":
    main()
