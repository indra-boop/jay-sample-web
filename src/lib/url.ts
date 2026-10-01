/**
 * Base-path aware URLs. The site can be served from a domain root ("/") or a sub-path
 * (GitHub Pages project site: "/jay-sample-web/"). Every root-relative internal URL goes
 * through `withBase`; external URLs, anchors and data: URIs pass through unchanged.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function withBase(path: string): string;
export function withBase(path: string | undefined): string | undefined;
export function withBase(path: string | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return path;
  if (BASE && (path === BASE || path.startsWith(`${BASE}/`))) return path; // already prefixed
  return `${BASE}${path}` || "/";
}

/** Absolute URL for metadata (canonical, OG, JSON-LD). */
export const absoluteUrl = (path: string, site: string) => new URL(withBase(path), site).toString();
