/**
 * Click-to-load embeds: no third-party iframe (or audio) until the visitor asks.
 * Provider embed URLs in data never contain autoplay params; we never add them.
 *
 * Two modes:
 *  - [data-embed-target]: toggle player inside the target container (MixRow). One open at a time.
 *  - no target: replace the facade button with the iframe (LiveSetEmbed, video).
 * Fallback: <html data-embed="link"> (sandboxed previews that block third-party frames) →
 *  play buttons become plain links to the provider page.
 */
const buttons = [...document.querySelectorAll<HTMLButtonElement>("button[data-embed-src]")];

function makeFrame(button: HTMLButtonElement) {
  const frame = document.createElement("iframe");
  frame.src = button.dataset["embedSrc"] ?? "";
  frame.title = button.dataset["embedTitle"] ?? "Embedded player";
  frame.allow = "encrypted-media; picture-in-picture; fullscreen";
  frame.referrerPolicy = "strict-origin-when-cross-origin";
  frame.className = "embed__frame";
  if (button.dataset["embedHeight"]) frame.height = button.dataset["embedHeight"];
  return frame;
}

function setLabel(button: HTMLButtonElement, open: boolean) {
  const label = button.querySelector<HTMLElement>("[data-label-play]");
  if (label) label.textContent = open ? (label.dataset["labelClose"] ?? "Close") : (label.dataset["labelPlay"] ?? "Listen");
}

function close(button: HTMLButtonElement) {
  const target = document.getElementById(button.dataset["embedTarget"] ?? "");
  if (!target) return;
  target.replaceChildren(); // removing the iframe stops playback
  target.hidden = true;
  button.setAttribute("aria-expanded", "false");
  setLabel(button, false);
}

if (document.documentElement.dataset["embed"] === "link") {
  buttons.forEach((button) => {
    const url = button.dataset["embedUrl"];
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = button.className;
    a.innerHTML = button.innerHTML;
    a.removeAttribute("aria-expanded");
    button.replaceWith(a);
  });
} else {
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset["embedTarget"];
      if (!targetId) {
        const frame = makeFrame(button);
        button.replaceWith(frame);
        frame.focus();
        return;
      }
      const target = document.getElementById(targetId);
      if (!target) return;
      if (button.getAttribute("aria-expanded") === "true") {
        close(button);
        return;
      }
      buttons.filter((b) => b !== button && b.getAttribute("aria-expanded") === "true").forEach(close);
      target.replaceChildren(makeFrame(button));
      target.hidden = false;
      button.setAttribute("aria-expanded", "true");
      setLabel(button, true);
    });
  });
}
