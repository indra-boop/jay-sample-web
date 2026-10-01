import type { APIRoute } from "astro";
import { navItems } from "@/data/site";
import { hiddenSections } from "@/lib/content";
import { siteUrl } from "@/lib/content-mode";
import { absoluteUrl } from "@/lib/url";

/** Hand-rolled sitemap (no extra dependency). Empty urlset until SITE_URL is configured. */
export const GET: APIRoute = () => {
  const hidden = hiddenSections();
  const paths = ["/", ...navItems.filter((n) => !hidden.includes(n.section)).map((n) => n.href)];
  const site = siteUrl;
  const urls = site ? paths.map((p) => `  <url><loc>${absoluteUrl(p, site)}</loc></url>`).join("\n") : "";
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
