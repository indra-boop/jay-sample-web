// Static checks over the built HTML (preview or production):
// - no fixture text leaks into public pages
// - no empty/dead social or platform links (href="" or "#")
// - every <img> has an alt attribute
// - exactly one <h1> per page
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname;
const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".html")) files.push(p);
  }
})(dist);

let errors = 0;
const fail = (file, msg) => {
  errors++;
  console.error(`✖ ${file.replace(dist, "")}: ${msg}`);
};
for (const file of files) {
  const html = readFileSync(file, "utf8");
  const isQa = file.includes("/qa/");
  if (!isQa && /SYNTHETIC FIXTURE/.test(html)) fail(file, "fixture content leaked");
  if (/href=""|href="#"(?![\w-])/.test(html)) fail(file, "empty/dead link");
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) if (!/\salt(=|\s|>|\/)/.test(img)) fail(file, `img without alt: ${img.slice(0, 80)}`);
  const h1 = (html.match(/<h1\b/g) ?? []).length;
  if (h1 !== 1) fail(file, `expected 1 <h1>, found ${h1}`);
}
console.log(`content-gate: ${files.length} page(s) checked, ${errors} error(s)`);
process.exit(errors ? 1 : 0);
