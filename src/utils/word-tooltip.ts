let hostEl: HTMLDivElement | null = null;
let shadowRoot: ShadowRoot | null = null;
let tooltipEl: HTMLDivElement | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;
let pinned = false;

const TOOLTIP_STYLES = `
  .mirlo-wt {
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 13px;
    line-height: 1.4;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
    padding: 6px 10px;
    white-space: nowrap;
    opacity: 0;
    transform: translateY(-2px);
    transition: opacity 100ms ease, transform 100ms ease;
  }
  :host(.is-visible) .mirlo-wt {
    opacity: 1;
    transform: translateY(0);
  }
  .mirlo-wt-original {
    color: #64748b;
    font-size: 12px;
  }
  .mirlo-wt-translation {
    color: #0f766e;
    font-weight: 600;
  }
  .mirlo-wt-arrow {
    color: #94a3b8;
    margin: 0 4px;
    font-size: 11px;
  }
`;

export function ensureWordTooltip(): {
  host: HTMLDivElement;
  shadow: ShadowRoot;
  tooltip: HTMLDivElement;
} {
  if (hostEl && shadowRoot && tooltipEl) {
    return { host: hostEl, shadow: shadowRoot, tooltip: tooltipEl };
  }

  hostEl = document.createElement("div");
  hostEl.id = "mirlo-word-tooltip-host";
  hostEl.style.position = "absolute";
  hostEl.style.zIndex = "2147483647";
  hostEl.style.pointerEvents = "none";
  shadowRoot = hostEl.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = TOOLTIP_STYLES;
  shadowRoot.appendChild(style);

  tooltipEl = document.createElement("div");
  tooltipEl.className = "mirlo-wt";
  tooltipEl.innerHTML = `<span class="mirlo-wt-original"></span><span class="mirlo-wt-arrow">→</span><span class="mirlo-wt-translation"></span>`;
  shadowRoot.appendChild(tooltipEl);

  hostEl.addEventListener("mouseenter", () => {
    pinned = true;
  });
  hostEl.addEventListener("mouseleave", () => {
    pinned = false;
    scheduleHideWordTooltip();
  });

  document.body.appendChild(hostEl);
  return { host: hostEl, shadow: shadowRoot, tooltip: tooltipEl };
}

export function showWordTooltip(span: HTMLSpanElement): void {
  const original = span.dataset.mirloOriginal || "";
  const translation = span.dataset.mirloTranslation || span.textContent || "";

  const { host, tooltip } = ensureWordTooltip();

  const originalEl = tooltip.querySelector(".mirlo-wt-original")!;
  const translationEl = tooltip.querySelector(".mirlo-wt-translation")!;
  originalEl.textContent = original;
  translationEl.textContent = translation;

  positionWordTooltip(span, host);
  host.classList.add("is-visible");
  host.style.pointerEvents = "auto";
  cancelHideTimer();
}

export function hideWordTooltip(): void {
  if (!hostEl) return;
  hostEl.classList.remove("is-visible");
  hostEl.style.pointerEvents = "none";
}

export function scheduleHideWordTooltip(): void {
  cancelHideTimer();
  hideTimer = setTimeout(() => {
    if (!pinned) hideWordTooltip();
  }, 120);
}

function cancelHideTimer(): void {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

function positionWordTooltip(span: HTMLSpanElement, host: HTMLDivElement): void {
  const rect = span.getBoundingClientRect();
  const gap = 6;

  let top = rect.bottom + window.scrollY + gap;
  const left = rect.left + window.scrollX;

  // Flip above if too close to viewport bottom
  const spaceBelow = window.innerHeight - rect.bottom;
  if (spaceBelow < 60) {
    top = rect.top + window.scrollY - gap - 36;
  }

  host.style.top = `${top}px`;
  host.style.left = `${left}px`;
}

export function destroyWordTooltip(): void {
  cancelHideTimer();
  if (hostEl) {
    hostEl.remove();
    hostEl = null;
    shadowRoot = null;
    tooltipEl = null;
  }
  pinned = false;
}
