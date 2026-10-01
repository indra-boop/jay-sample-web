import type { BookingConfig } from "@/types/content";

/**
 * Booking configuration.
 * DATA BELUM ADA: form endpoint, booking email, management contact, WhatsApp, privacy notice.
 * Option lists below are generic form choices (ASSUMPTION), not claims about the artist.
 */
export const booking: BookingConfig = {
  // formEndpoint: { value: "https://…", status: "DATA FINAL", source: "" },
  // bookingEmail: { value: "booking@…", status: "DATA FINAL", source: "" },
  // privacyNotice: { value: "…", status: "DATA FINAL", source: "" },
  eventTypes: ["Club night", "Private event", "Festival", "Corporate event", "Wedding", "Other"],
  audienceRanges: ["Under 100", "100–300", "300–1,000", "1,000+", "Not sure yet"],
  performanceFormats: ["DJ set", "Hybrid: DJ + live musicians", "Extended set", "To be discussed"],
};
