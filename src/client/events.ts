/**
 * Static builds go stale: an "upcoming" event built yesterday may be past today.
 * Hide upcoming rows whose date is before the visitor's local date (build splits the rest).
 */
const today = new Date();
const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
document.querySelectorAll<HTMLElement>("[data-upcoming] [data-event-date]").forEach((row) => {
  if ((row.dataset["eventDate"] ?? "") < iso) row.hidden = true;
});
