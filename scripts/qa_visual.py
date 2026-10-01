"""Visual + responsive QA: screenshots and automated checks at 320–1920px."""
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = "http://localhost:4321"
OUT = Path(sys.argv[1] if len(sys.argv) > 1 else "qa-shots")
OUT.mkdir(parents=True, exist_ok=True)
WIDTHS = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920]
PAGES = ["/", "/booking", "/events", "/qa/components"]

CHECK_JS = """
() => {
  const doc = document.documentElement;
  const overflow = doc.scrollWidth - doc.clientWidth;
  const offenders = [];
  if (overflow > 0) {
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.right > doc.clientWidth + 1 && getComputedStyle(el).position !== 'fixed') offenders.push(el.className || el.tagName);
      if (offenders.length > 5) break;
    }
  }
  const small = [];
  for (const el of document.querySelectorAll('a[href], button, input, select, textarea')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || el.closest('[hidden], dialog:not([open]), [aria-hidden="true"]')) continue;
    if (el.classList.contains('skip-link') || el.closest('.bf__hp')) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.height < 44 || r.width < 24) small.push(`${el.tagName.toLowerCase()}.${el.className || ''} ${Math.round(r.width)}x${Math.round(r.height)} "${(el.textContent||'').trim().slice(0,30)}"`);
  }
  const logo = document.querySelector('.hero__logo');
  let logoBox = null;
  if (logo) { const r = logo.getBoundingClientRect(); logoBox = {left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), height: Math.round(r.height), vw: doc.clientWidth}; }
  return { overflow, offenders, small: [...new Set(small)].slice(0, 12), logoBox, h1: document.querySelectorAll('h1').length };
}
"""

report = {}
with sync_playwright() as p:
    browser = p.chromium.launch()
    for path in PAGES:
        for w in WIDTHS:
            if path != "/" and w not in (320, 390, 768, 1440):
                continue
            h = 900 if w >= 1024 else 844
            ctx = browser.new_context(viewport={"width": w, "height": h}, reduced_motion="reduce", device_scale_factor=1)
            page = ctx.new_page()
            errors = []
            page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.goto(BASE + path, wait_until="networkidle")
            page.wait_for_timeout(300)
            res = page.evaluate(CHECK_JS)
            res["console_errors"] = errors
            slug = (path.strip("/") or "home").replace("/", "-")
            page.screenshot(path=str(OUT / f"{slug}-{w}.png"), full_page=True)
            report[f"{path}@{w}"] = res
            ctx.close()

    # Above-the-fold with motion enabled (after reveal finishes)
    for w, h in [(390, 844), (1440, 900)]:
        ctx = browser.new_context(viewport={"width": w, "height": h}, reduced_motion="no-preference")
        page = ctx.new_page()
        page.goto(BASE + "/", wait_until="networkidle")
        page.wait_for_timeout(2600)
        page.screenshot(path=str(OUT / f"hero-motion-{w}.png"))
        ctx.close()
    browser.close()

(OUT / "report.json").write_text(json.dumps(report, indent=2))
bad = {k: v for k, v in report.items() if v["overflow"] > 0 or v["console_errors"] or v["h1"] != 1 or v["small"]}
print(json.dumps(bad, indent=2) if bad else "ALL CLEAN")
for k, v in report.items():
    if v["logoBox"]:
        print(k, v["logoBox"])
