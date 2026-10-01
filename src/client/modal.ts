/**
 * Native <dialog> wiring (shared by mobile menu + lightbox).
 * - [data-modal-open="id"]  → showModal(), remembers trigger, sets aria-expanded
 * - [data-modal-close]      → close()
 * - backdrop click          → close()
 * - on close                → focus returns to trigger (native dialogs do this inconsistently)
 */
const triggers = new WeakMap<HTMLDialogElement, HTMLElement>();

function open(dialog: HTMLDialogElement, trigger?: HTMLElement) {
  if (dialog.open) return;
  if (trigger) {
    triggers.set(dialog, trigger);
    trigger.setAttribute("aria-expanded", "true");
  }
  dialog.showModal();
}

document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement | null;
  if (!target) return;

  const opener = target.closest<HTMLElement>("[data-modal-open]");
  if (opener) {
    const dialog = document.getElementById(opener.dataset["modalOpen"] ?? "");
    if (dialog instanceof HTMLDialogElement) {
      event.preventDefault();
      open(dialog, opener);
    }
    return;
  }

  const closer = target.closest<HTMLElement>("[data-modal-close]");
  if (closer) {
    closer.closest("dialog")?.close();
    return;
  }

  // Click on the backdrop: the event target is the dialog element itself.
  if (target instanceof HTMLDialogElement && target.open) {
    const r = target.getBoundingClientRect();
    const e = event as MouseEvent;
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside || target.dataset["backdropClose"] === "true") target.close();
  }
});

document.addEventListener(
  "close",
  (event) => {
    const dialog = event.target;
    if (!(dialog instanceof HTMLDialogElement)) return;
    const trigger = triggers.get(dialog);
    if (trigger) {
      trigger.setAttribute("aria-expanded", "false");
      trigger.focus();
      triggers.delete(dialog);
    }
  },
  true,
);

export { open as openModal };
