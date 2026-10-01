/**
 * BookingForm — progressive enhancement over native constraint validation.
 * - novalidate on the form; we run checkValidity() and render our own messages
 * - each error is linked via aria-describedby, field gets aria-invalid
 * - first invalid field receives focus; summary is announced via role=status
 * - honeypot field (`website`) silently drops bots
 * - no endpoint configured (DATA BELUM ADA) → explicit preview message, nothing is sent
 */

const MESSAGES: Record<string, (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => string> = {
  valueMissing: (el) => `${labelOf(el)} is required.`,
  typeMismatch: (el) => (el.type === "email" ? "Enter a valid email address, e.g. name@domain.com." : `Enter a valid ${labelOf(el).toLowerCase()}.`),
  patternMismatch: (el) => el.dataset["patternMessage"] ?? `Check the format of ${labelOf(el).toLowerCase()}.`,
  tooShort: (el) => `${labelOf(el)} needs at least ${(el as HTMLInputElement).minLength} characters.`,
  rangeUnderflow: () => "Choose a date from today onwards.",
};

function labelOf(el: Element) {
  const id = el.getAttribute("id");
  const label = id ? document.querySelector(`label[for="${id}"] [data-label-text]`) : null;
  return label?.textContent?.trim() ?? "This field";
}

function messageFor(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  const v = el.validity;
  for (const key of Object.keys(MESSAGES)) {
    if (v[key as keyof ValidityState]) return MESSAGES[key]!(el);
  }
  return el.validationMessage;
}

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function setError(field: Field, message: string) {
  const errorEl = document.getElementById(`${field.id}-error`);
  if (!errorEl) return;
  errorEl.textContent = message;
  errorEl.hidden = !message;
  if (message) field.setAttribute("aria-invalid", "true");
  else field.removeAttribute("aria-invalid");
}

document.querySelectorAll<HTMLFormElement>("form[data-booking-form]").forEach((form) => {
  const status = form.querySelector<HTMLElement>("[data-form-status]");
  const submit = form.querySelector<HTMLButtonElement>("button[type='submit']");
  const fields = [...form.querySelectorAll<Field>("input:not([type='hidden']):not([name='website']), select, textarea")];
  const endpoint = form.dataset["endpoint"] ?? "";

  // Date min = visitor's today (static build can't know it).
  const date = form.querySelector<HTMLInputElement>("input[type='date']");
  if (date) {
    const t = new Date();
    date.min = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  }

  const announce = (text: string, tone: "error" | "success" | "info") => {
    if (!status) return;
    status.textContent = text;
    status.dataset["tone"] = tone;
    status.hidden = false;
  };

  // Validate on blur after first interaction; clear while typing once valid.
  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      if (field.dataset["touched"] !== "true" && !field.value) return;
      field.dataset["touched"] = "true";
      setError(field, field.checkValidity() ? "" : messageFor(field));
    });
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true" && field.checkValidity()) setError(field, "");
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const invalid = fields.filter((f) => !f.checkValidity());
    fields.forEach((f) => setError(f, f.checkValidity() ? "" : messageFor(f)));

    if (invalid.length) {
      announce(`Please fix ${invalid.length} field${invalid.length > 1 ? "s" : ""} before sending.`, "error");
      invalid[0]?.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    if (data["website"]) return; // honeypot
    delete data["website"];

    const mailto = form.dataset["mailto"] ?? "";
    if (!endpoint && mailto) {
      // Email-only fallback: hand the composed request to the visitor's mail app.
      const body = Object.entries(data)
        .filter(([, v]) => String(v).trim())
        .map(([k, v]) => `${k}: ${String(v)}`)
        .join("\n");
      const subject = `Booking request — ${String(data["eventName"] || data["eventDate"] || "Jay Sample")}`;
      window.location.href = `mailto:${mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      announce("Your email app should open with the request filled in. Please press send there.", "info");
      return;
    }

    if (!endpoint) {
      announce("Preview build: booking channel is not configured yet, so nothing was sent. (DATA BELUM ADA: booking endpoint or booking email)", "info");
      return;
    }

    submit?.setAttribute("disabled", "");
    submit?.setAttribute("aria-busy", "true");
    announce("Sending your booking request…", "info");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      fields.forEach((f) => delete f.dataset["touched"]);
      announce("Thank you — your booking request has been sent.", "success");
    } catch {
      announce("Your request could not be sent. Please try again in a moment.", "error");
    } finally {
      submit?.removeAttribute("disabled");
      submit?.removeAttribute("aria-busy");
    }
  });
});
