import type { APIRoute } from "astro";
import { isPreview, siteUrl } from "@/lib/content-mode";
import { absoluteUrl } from "@/lib/url";

export const GET: APIRoute = () => {
  const body = isPreview
    ? "User-agent: *\nDisallow: /\n"
    : `User-agent: *\nAllow: /\nDisallow: /qa/\n${siteUrl ? `Sitemap: ${absoluteUrl("/sitemap.xml", siteUrl)}\n` : ""}`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
