import { CONTENT_MODE, SITE_URL } from "astro:env/server";

/** preview: show gap notices + ghost layouts, noindex. production: hide empty sections. */
export const isPreview = CONTENT_MODE === "preview";
export const isProduction = CONTENT_MODE === "production";
export const siteUrl: string | undefined = SITE_URL || undefined;
