const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/** Parse YYYY-MM-DD as a calendar date (no timezone shift). */
export function parseIsoDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { year: y ?? 0, month: (m ?? 1) - 1, day: d ?? 1 };
}

export function eventDateParts(iso: string) {
  const { year, month, day } = parseIsoDate(iso);
  return { day: String(day).padStart(2, "0"), month: MONTHS[month] ?? "", year: String(year) };
}

export function releaseYear(value: string) {
  return value.slice(0, 4);
}

/** Today (build time). Timezone default = ASSUMPTION (Bali/WITA) until artist base is confirmed. */
export function todayIso(timeZone = "Asia/Makassar") {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
