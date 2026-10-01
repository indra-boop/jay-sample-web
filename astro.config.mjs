// @ts-check
import { defineConfig, envField } from "astro/config";

// SITE_URL = production domain (DATA BELUM ADA). Without it: no canonical, no sitemap.
const SITE_URL = process.env.SITE_URL;
// Sub-path hosting (GitHub Pages project site) e.g. BASE_PATH=/jay-sample-web
const BASE_PATH = process.env.BASE_PATH || "/";

export default defineConfig({
  ...(SITE_URL ? { site: SITE_URL } : {}),
  base: BASE_PATH,
  output: "static",
  trailingSlash: "never",
  build: { format: "file", inlineStylesheets: "auto" },
  compressHTML: true,
  devToolbar: { enabled: false },
  env: {
    schema: {
      CONTENT_MODE: envField.enum({
        context: "server",
        access: "public",
        values: ["preview", "production"],
        default: "preview",
      }),
      SITE_URL: envField.string({ context: "server", access: "public", optional: true }),
    },
  },
});
