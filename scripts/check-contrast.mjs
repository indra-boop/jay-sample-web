// Contrast gate — WCAG 2.1 AA (4.5:1 text, 3:1 control boundaries / focus).
// Mirrors jerco-design-system tests/e2e/theme-contrast-desktop.spec.ts intent, run statically.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/styles/tokens.css", import.meta.url), "utf8");
const decl = new Map();
for (const m of css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) decl.set(m[1], m[2].trim());

function resolve(name, depth = 0) {
  const v = decl.get(name);
  if (!v) throw new Error(`Unknown token ${name}`);
  const ref = v.match(/^var\((--[\w-]+)\)$/);
  if (ref && depth < 10) return resolve(ref[1], depth + 1);
  return v;
}

function oklchToRgb(value) {
  const m = value.match(/oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)/);
  if (!m) throw new Error(`Not oklch: ${value}`);
  const L = Number(m[1]) / 100, C = Number(m[2]), h = (Number(m[3]) * Math.PI) / 180;
  const a = C * Math.cos(h), b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s,
  ];
  return lin.map((x) => Math.min(1, Math.max(0, x)));
}

const lum = (rgbLin) => 0.2126 * rgbLin[0] + 0.7152 * rgbLin[1] + 0.0722 * rgbLin[2];
const ratio = (fg, bg) => {
  const [a, b] = [lum(oklchToRgb(resolve(fg))), lum(oklchToRgb(resolve(bg)))];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

const surfaces = ["--background", "--surface", "--surface-raised"];
const checks = [
  ...["--foreground", "--foreground-muted", "--foreground-subtle", "--status-danger", "--status-success"]
    .flatMap((fg) => surfaces.map((bg) => [fg, bg, 4.5, "text"])),
  ...surfaces.map((bg) => ["--border-input", bg, 3, "control boundary"]),
  ...surfaces.map((bg) => ["--focus-ring", bg, 3, "focus indicator"]),
  ["--action-primary-foreground", "--action-primary", 4.5, "button text"],
  ["--action-primary-foreground", "--action-primary-hover", 4.5, "button text hover"],
  ["--foreground", "--surface-hover", 4.5, "text on hover"],
];

let failed = 0;
console.log("token".padEnd(30), "on".padEnd(18), "ratio", "min", "result");
for (const [fg, bg, min, role] of checks) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(fg.padEnd(30), bg.padEnd(18), r.toFixed(2).padStart(5), String(min).padStart(3), ok ? "PASS" : "FAIL", `(${role})`);
}
if (failed) {
  console.error(`\n${failed} contrast check(s) failed`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} contrast checks pass.`);
