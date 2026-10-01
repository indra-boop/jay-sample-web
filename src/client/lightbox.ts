/**
 * Lightbox for MediaGrid: one <dialog id="lightbox">, items are <button data-lightbox-index>.
 * Keyboard: ←/→ navigate, Esc closes (native). Hi-res image loads only on open.
 */
import { openModal } from "./modal";

interface Item {
  src: string;
  alt: string;
  caption: string;
  credit: string;
}

const dialog = document.getElementById("lightbox");
if (dialog instanceof HTMLDialogElement) {
  const img = dialog.querySelector<HTMLImageElement>("[data-lightbox-img]");
  const caption = dialog.querySelector<HTMLElement>("[data-lightbox-caption]");
  const counter = dialog.querySelector<HTMLElement>("[data-lightbox-counter]");
  const triggers = [...document.querySelectorAll<HTMLButtonElement>("[data-lightbox-index]")];
  const items: Item[] = triggers.map((t) => ({
    src: t.dataset["full"] ?? "",
    alt: t.dataset["alt"] ?? "",
    caption: t.dataset["caption"] ?? "",
    credit: t.dataset["credit"] ?? "",
  }));
  let index = 0;

  const show = (i: number) => {
    index = (i + items.length) % items.length;
    const item = items[index];
    if (!item || !img) return;
    img.src = item.src;
    img.alt = item.alt;
    if (caption) caption.textContent = [item.caption, item.credit].filter(Boolean).join(" — ");
    if (counter) counter.textContent = `${index + 1} / ${items.length}`;
  };

  triggers.forEach((t, i) =>
    t.addEventListener("click", () => {
      show(i);
      openModal(dialog, t);
    }),
  );
  dialog.querySelector("[data-lightbox-prev]")?.addEventListener("click", () => show(index - 1));
  dialog.querySelector("[data-lightbox-next]")?.addEventListener("click", () => show(index + 1));
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
  dialog.addEventListener("close", () => {
    if (img) img.removeAttribute("src");
  });
}
