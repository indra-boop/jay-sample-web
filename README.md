# Jay Sample — Official Website

Static Astro 5 + TypeScript (strict). Zero framework runtime; JS only for menu, lightbox, booking form, embeds.

Live staging (preview build, noindex): https://indra-boop.github.io/jay-sample-web/

| Item | Isi |
|---|---|
| `public/brand/manifest.json` | Logo exports + SHA-256 + optical bounds |
| `.github/workflows/deploy.yml` | Push ke `main` → check, contrast, build, gate → GitHub Pages |
| `docs/` (lokal, tidak di-commit) | Design spec, QA report, content gaps (generated tiap build) |

## Commands

```bash
npm install
npm run dev                 # local dev
npm run brand:export        # re-export logo/OG/icons from brand-source/ (python3 + Pillow)
npm run qa                  # astro check + contrast + build + content gate
npm run build               # preview build (noindex, gap notices, /qa/components)
SITE_URL=https://domain npm run build:production   # fails until blocking data exists
BASE_PATH=/jay-sample-web npm run build            # sub-path hosting (GitHub Pages project site)
python3 scripts/qa_visual.py out/   # screenshots 320–1920 (needs `npm run preview` running)
```

## Where content goes (no CMS yet — CMS-ready shapes)

| File | Isi |
|---|---|
| `src/data/artist.ts` | name, role, bio, genres, portrait, hero media |
| `src/data/music.ts` | releases + live sets |
| `src/data/events.ts` | events (upcoming/past split by date) |
| `src/data/media.ts` | gallery |
| `src/data/socials.ts` | social URLs (only configured ones render) |
| `src/data/booking.ts` | endpoint / email / WhatsApp / privacy notice |

Every record carries `status` (`DATA FINAL` / `ASSUMPTION` / `CLIENT CONFIRMATION` / `FIELD VERIFICATION`). **Production renders `DATA FINAL` only.**

## Rules
- Logo: never redraw/recolor/stretch; only `scripts/build_brand_exports.py` produces derivatives. Vector master = DATA BELUM ADA.
- Tokens: `src/styles/tokens.css` only (Jerco naming convention, Jay Sample values). `npm run contrast` must pass.
- Font: Archivo (OFL-1.1) — ASSUMPTION, swap in `src/styles/fonts.css` + `--font-sans`.
