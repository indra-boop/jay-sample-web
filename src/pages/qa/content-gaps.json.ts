import type { APIRoute } from "astro";
import { getContentGaps, formatGap } from "@/lib/content-gaps";
import { CONTENT_MODE } from "astro:env/server";

/** Build artefact read by scripts/postbuild.mjs (then removed from dist). */
export const GET: APIRoute = () => {
  const gaps = getContentGaps();
  return new Response(JSON.stringify({ mode: CONTENT_MODE, gaps: gaps.map((g) => ({ ...g, line: formatGap(g) })) }, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
};
