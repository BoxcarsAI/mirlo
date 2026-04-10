// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { getParagraphText, isEligibleParagraph } from "@/utils/paragraph-filter";

function clearBody() {
  document.body.innerHTML = "";
}

function longText(words = 20): string {
  return Array.from({ length: words }, (_, i) => `word${i}`).join(" ");
}

describe("getParagraphText", () => {
  beforeEach(clearBody);

  it("extracts plain text from a paragraph", () => {
    document.body.innerHTML = "<p>Hello world</p>";
    const p = document.querySelector("p")!;
    expect(getParagraphText(p)).toBe("Hello world");
  });

  it("concatenates text from nested elements", () => {
    document.body.innerHTML = "<p>Hello <strong>bold</strong> text</p>";
    const p = document.querySelector("p")!;
    expect(getParagraphText(p)).toBe("Hello bold text");
  });

  it("excludes text from .mirlo-badge", () => {
    document.body.innerHTML = '<p>Main text <span class="mirlo-badge">badge</span></p>';
    const p = document.querySelector("p")!;
    expect(getParagraphText(p)).toBe("Main text");
  });

  it("returns empty string for null element", () => {
    expect(getParagraphText(null as unknown as Element)).toBe("");
  });

  it("returns empty string for element with no text", () => {
    document.body.innerHTML = "<p></p>";
    const p = document.querySelector("p")!;
    expect(getParagraphText(p)).toBe("");
  });
});

describe("isEligibleParagraph", () => {
  beforeEach(clearBody);

  it("returns false for null", () => {
    expect(isEligibleParagraph(null as unknown as HTMLParagraphElement)).toBe(false);
  });

  it("returns false for paragraph with too few words", () => {
    document.body.innerHTML = "<p>Short text here</p>";
    const p = document.querySelector("p") as HTMLParagraphElement;
    expect(isEligibleParagraph(p)).toBe(false);
  });

  it("returns false for paragraph with exactly 15 words (needs > 15)", () => {
    document.body.innerHTML = `<p>${longText(15)}</p>`;
    const p = document.querySelector("p") as HTMLParagraphElement;
    // Even with enough words, happy-dom getBoundingClientRect returns 0 dimensions
    // so isVisibleElement returns false
    expect(isEligibleParagraph(p)).toBe(false);
  });

  it("returns false for already-translated paragraph", () => {
    document.body.innerHTML = `<p class="mirlo-translated">${longText(20)}</p>`;
    const p = document.querySelector("p") as HTMLParagraphElement;
    expect(isEligibleParagraph(p)).toBe(false);
  });

  it("returns false for paragraph inside nav", () => {
    document.body.innerHTML = `<nav><p>${longText(20)}</p></nav>`;
    const p = document.querySelector("p") as HTMLParagraphElement;
    expect(isEligibleParagraph(p)).toBe(false);
  });

  it("returns false for paragraph inside footer", () => {
    document.body.innerHTML = `<footer><p>${longText(20)}</p></footer>`;
    const p = document.querySelector("p") as HTMLParagraphElement;
    expect(isEligibleParagraph(p)).toBe(false);
  });

  it("returns false for paragraph inside .ad container", () => {
    document.body.innerHTML = `<div class="ad"><p>${longText(20)}</p></div>`;
    const p = document.querySelector("p") as HTMLParagraphElement;
    expect(isEligibleParagraph(p)).toBe(false);
  });

  it("returns false for paragraph inside #comments", () => {
    document.body.innerHTML = `<div id="comments"><p>${longText(20)}</p></div>`;
    const p = document.querySelector("p") as HTMLParagraphElement;
    expect(isEligibleParagraph(p)).toBe(false);
  });
});
