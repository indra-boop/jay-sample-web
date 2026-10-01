/**
 * Content schema — Jay Sample.
 * Every factual record carries `status` so placeholder data can never silently ship.
 * Shapes are CMS-ready (flat, serialisable, ISO dates, absolute URLs).
 */

export type EvidenceStatus = "DATA FINAL" | "ASSUMPTION" | "CLIENT CONFIRMATION" | "FIELD VERIFICATION";

export interface Verified<T> {
  value: T;
  status: EvidenceStatus;
  /** Where the value came from (email, contract, owner chat, URL…). */
  source?: string;
}

export interface ImageAsset {
  /** Path under /public (e.g. /images/about/portrait-1600w.jpg) or absolute URL. */
  src: string;
  /** Optional responsive set: width → path. */
  srcset?: Record<number, string>;
  width: number;
  height: number;
  /** Meaningful alt text. Empty string only if purely decorative. */
  alt: string;
  /** Photographer / rights holder — required before production use. */
  credit?: string;
}

/* ---------- Artist ---------- */
export interface Artist {
  name: string; // DATA FINAL — from supplied logo
  role: string; // e.g. "DJ / Artist"
  tagline?: Verified<string>;
  genres?: Verified<string[]>;
  origin?: Verified<string>;
  basedIn?: Verified<string>;
  bio?: Verified<string[]>; // paragraphs
  influences?: Verified<string[]>;
  residencies?: Verified<string[]>;
  notableVenues?: Verified<string[]>;
  collaborations?: Verified<string[]>;
  portrait?: ImageAsset & { status: EvidenceStatus };
  heroMedia?: {
    image?: ImageAsset;
    video?: { src: string; type: "video/mp4" | "video/webm"; poster: string };
    status: EvidenceStatus;
  };
}

/* ---------- Social ---------- */
export type SocialPlatform =
  | "instagram"
  | "spotify"
  | "soundcloud"
  | "youtube"
  | "tiktok"
  | "mixcloud"
  | "beatport";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  handle?: string;
  status: EvidenceStatus;
}

/* ---------- Music ---------- */
export type MusicPlatform =
  | "spotify"
  | "appleMusic"
  | "soundcloud"
  | "youtube"
  | "beatport"
  | "mixcloud";

export type ReleaseType = "Single" | "EP" | "Album" | "Remix" | "Mix" | "Live Set";

export interface Release {
  id: string;
  title: string;
  type: ReleaseType;
  /** ISO date (YYYY-MM-DD) or year (YYYY). */
  releaseDate: string;
  artwork?: ImageAsset;
  links: Partial<Record<MusicPlatform, string>>;
  featured?: boolean;
  status: EvidenceStatus;
}

export type EmbedProvider = "youtube" | "vimeo" | "mixcloud" | "soundcloud";

export interface LiveSet {
  id: string;
  title: string;
  provider: EmbedProvider;
  /** Canonical public URL of the set. */
  url: string;
  /** Provider embed URL (no autoplay params). */
  embedUrl: string;
  recordedAt?: string;
  venue?: string;
  /** As shown by the provider, e.g. "1:30:58". */
  duration?: string;
  poster?: ImageAsset;
  status: EvidenceStatus;
}

/* ---------- Events ---------- */
export type EventStatus = "on-sale" | "sold-out" | "free" | "invite-only" | "cancelled" | "postponed" | "announced";

export interface ArtistEvent {
  id: string;
  /** ISO date YYYY-MM-DD (local date of the show). */
  date: string;
  startTime?: string; // HH:mm local
  timezone?: string; // IANA, e.g. Asia/Makassar
  eventName?: string;
  venue: string;
  city: string;
  country: string;
  ticketUrl?: string;
  eventStatus: EventStatus;
  status: EvidenceStatus;
}

/* ---------- Media ---------- */
export type MediaKind = "performance" | "portrait" | "venue" | "video" | "press";

export interface MediaItem {
  id: string;
  kind: MediaKind;
  image: ImageAsset;
  /** Hi-res source for the lightbox (defaults to image.src). */
  fullSrc?: string;
  caption?: string;
  videoUrl?: string; // when kind === "video": opens externally
  status: EvidenceStatus;
}

/* ---------- Booking ---------- */
export interface BookingConfig {
  /** POST endpoint receiving JSON. DATA BELUM ADA until configured. */
  formEndpoint?: Verified<string>;
  bookingEmail?: Verified<string>;
  management?: Verified<{ name: string; email?: string; phone?: string }>;
  whatsapp?: Verified<string>; // E.164, e.g. +62…
  privacyNotice?: Verified<string>;
  eventTypes: string[];
  audienceRanges: string[];
  performanceFormats: string[];
}

/* ---------- Gaps ---------- */
export interface ContentGap {
  item: string;
  resolver: string;
  owner: string;
  /** Blocks `npm run build:production`. */
  blocking: boolean;
  area: "brand" | "music" | "events" | "about" | "media" | "socials" | "booking" | "seo";
  label?: "DATA BELUM ADA" | "CLIENT CONFIRMATION";
}
