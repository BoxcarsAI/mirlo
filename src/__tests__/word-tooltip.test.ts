// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  ensureWordTooltip,
  showWordTooltip,
  hideWordTooltip,
  scheduleHideWordTooltip,
  destroyWordTooltip,
} from "@/utils/word-tooltip";

function createTranslatedSpan(original: string, translation: string): HTMLSpanElement {
  const span = document.createElement("span");
  span.className = "mirlo-word mirlo-word-translated";
  span.dataset.mirloOriginal = original;
  span.dataset.mirloTranslation = translation;
  span.textContent = translation;
  document.body.appendChild(span);
  return span;
}

describe("ensureWordTooltip", () => {
  beforeEach(() => {
    destroyWordTooltip();
    document.body.innerHTML = "";
  });

  it("creates a host element with shadow root", () => {
    const { host, shadow } = ensureWordTooltip();
    expect(host).toBeInstanceOf(HTMLDivElement);
    expect(shadow).toBeDefined();
    expect(host.shadowRoot).toBe(shadow);
  });

  it("appends host to document body", () => {
    ensureWordTooltip();
    const host = document.getElementById("mirlo-word-tooltip-host");
    expect(host).not.toBeNull();
  });

  it("sets host to absolute positioning", () => {
    const { host } = ensureWordTooltip();
    expect(host.style.position).toBe("absolute");
    expect(host.style.zIndex).toBe("2147483647");
    expect(host.style.pointerEvents).toBe("none");
  });

  it("returns same instance on repeated calls", () => {
    const first = ensureWordTooltip();
    const second = ensureWordTooltip();
    expect(first.host).toBe(second.host);
    expect(first.shadow).toBe(second.shadow);
  });

  it("contains tooltip with original, arrow, and translation slots", () => {
    const { tooltip } = ensureWordTooltip();
    expect(tooltip.querySelector(".mirlo-wt-original")).not.toBeNull();
    expect(tooltip.querySelector(".mirlo-wt-arrow")).not.toBeNull();
    expect(tooltip.querySelector(".mirlo-wt-translation")).not.toBeNull();
  });

  it("injects styles into shadow root", () => {
    const { shadow } = ensureWordTooltip();
    const style = shadow.querySelector("style");
    expect(style).not.toBeNull();
    expect(style!.textContent).toContain("mirlo-wt");
  });
});

describe("showWordTooltip", () => {
  beforeEach(() => {
    destroyWordTooltip();
    document.body.innerHTML = "";
  });

  it("shows tooltip with original and translated text", () => {
    const span = createTranslatedSpan("fox", "zorro");
    showWordTooltip(span);

    const { tooltip } = ensureWordTooltip();
    const original = tooltip.querySelector(".mirlo-wt-original")!;
    const translation = tooltip.querySelector(".mirlo-wt-translation")!;

    expect(original.textContent).toBe("fox");
    expect(translation.textContent).toBe("zorro");
  });

  it("adds is-visible class and enables pointer events", () => {
    const span = createTranslatedSpan("cat", "gato");
    showWordTooltip(span);

    const host = document.getElementById("mirlo-word-tooltip-host")!;
    expect(host.classList.contains("is-visible")).toBe(true);
    expect(host.style.pointerEvents).toBe("auto");
  });

  it("positions host element with top and left", () => {
    const span = createTranslatedSpan("dog", "perro");
    showWordTooltip(span);

    const host = document.getElementById("mirlo-word-tooltip-host")!;
    expect(host.style.top).toBeTruthy();
    expect(host.style.left).toBeTruthy();
  });

  it("updates content when showing for a different word", () => {
    const span1 = createTranslatedSpan("fox", "zorro");
    const span2 = createTranslatedSpan("cat", "gato");

    showWordTooltip(span1);
    showWordTooltip(span2);

    const { tooltip } = ensureWordTooltip();
    expect(tooltip.querySelector(".mirlo-wt-original")!.textContent).toBe("cat");
    expect(tooltip.querySelector(".mirlo-wt-translation")!.textContent).toBe("gato");
  });
});

describe("hideWordTooltip", () => {
  beforeEach(() => {
    destroyWordTooltip();
    document.body.innerHTML = "";
  });

  it("removes is-visible class and disables pointer events", () => {
    const span = createTranslatedSpan("dog", "perro");
    showWordTooltip(span);
    hideWordTooltip();

    const host = document.getElementById("mirlo-word-tooltip-host")!;
    expect(host.classList.contains("is-visible")).toBe(false);
    expect(host.style.pointerEvents).toBe("none");
  });

  it("is a no-op when tooltip does not exist", () => {
    // Should not throw
    hideWordTooltip();
  });
});

describe("destroyWordTooltip", () => {
  beforeEach(() => {
    destroyWordTooltip();
    document.body.innerHTML = "";
  });

  it("removes host element from DOM", () => {
    ensureWordTooltip();
    destroyWordTooltip();
    expect(document.getElementById("mirlo-word-tooltip-host")).toBeNull();
  });

  it("allows re-creation after destroy", () => {
    ensureWordTooltip();
    destroyWordTooltip();
    const { host } = ensureWordTooltip();
    expect(host).toBeInstanceOf(HTMLDivElement);
    expect(document.getElementById("mirlo-word-tooltip-host")).not.toBeNull();
  });

  it("is a no-op when nothing exists", () => {
    // Should not throw
    destroyWordTooltip();
    destroyWordTooltip();
  });
});

describe("scheduleHideWordTooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    destroyWordTooltip();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("hides tooltip after 120ms delay", () => {
    const span = createTranslatedSpan("fox", "zorro");
    showWordTooltip(span);

    const host = document.getElementById("mirlo-word-tooltip-host")!;
    expect(host.classList.contains("is-visible")).toBe(true);

    scheduleHideWordTooltip();

    // Not hidden yet
    vi.advanceTimersByTime(100);
    expect(host.classList.contains("is-visible")).toBe(true);

    // Hidden after 120ms
    vi.advanceTimersByTime(30);
    expect(host.classList.contains("is-visible")).toBe(false);
    expect(host.style.pointerEvents).toBe("none");
  });

  it("is cancelled by showing a new word", () => {
    const span1 = createTranslatedSpan("fox", "zorro");
    const span2 = createTranslatedSpan("cat", "gato");
    showWordTooltip(span1);

    scheduleHideWordTooltip();
    vi.advanceTimersByTime(50);

    // Show new word before timer fires — cancels the hide
    showWordTooltip(span2);
    vi.advanceTimersByTime(100);

    const host = document.getElementById("mirlo-word-tooltip-host")!;
    expect(host.classList.contains("is-visible")).toBe(true);

    const { tooltip } = ensureWordTooltip();
    expect(tooltip.querySelector(".mirlo-wt-original")!.textContent).toBe("cat");
  });
});

describe("showWordTooltip edge cases", () => {
  beforeEach(() => {
    destroyWordTooltip();
    document.body.innerHTML = "";
  });

  it("handles span with missing mirloTranslation by using textContent", () => {
    const span = document.createElement("span");
    span.className = "mirlo-word mirlo-word-translated";
    span.dataset.mirloOriginal = "hello";
    span.textContent = "hola";
    document.body.appendChild(span);

    showWordTooltip(span);
    const { tooltip } = ensureWordTooltip();
    expect(tooltip.querySelector(".mirlo-wt-original")!.textContent).toBe("hello");
    expect(tooltip.querySelector(".mirlo-wt-translation")!.textContent).toBe("hola");
  });

  it("handles span with missing mirloOriginal gracefully", () => {
    const span = document.createElement("span");
    span.className = "mirlo-word mirlo-word-translated";
    span.textContent = "hola";
    document.body.appendChild(span);

    showWordTooltip(span);
    const { tooltip } = ensureWordTooltip();
    expect(tooltip.querySelector(".mirlo-wt-original")!.textContent).toBe("");
  });

  it("full lifecycle: show → hide → show again", () => {
    const span1 = createTranslatedSpan("fox", "zorro");
    const span2 = createTranslatedSpan("dog", "perro");

    showWordTooltip(span1);
    const host = document.getElementById("mirlo-word-tooltip-host")!;
    expect(host.classList.contains("is-visible")).toBe(true);

    hideWordTooltip();
    expect(host.classList.contains("is-visible")).toBe(false);

    showWordTooltip(span2);
    expect(host.classList.contains("is-visible")).toBe(true);
    const { tooltip } = ensureWordTooltip();
    expect(tooltip.querySelector(".mirlo-wt-original")!.textContent).toBe("dog");
  });
});
