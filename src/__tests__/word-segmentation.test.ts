// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import {
  PLAIN_PARAGRAPH,
  NESTED_INLINE,
  WITH_LINK,
  DEEPLY_NESTED,
  MIXED_INLINE,
  SINGLE_WORD,
  WITH_PUNCTUATION,
  WITH_BADGE,
  ALREADY_SEGMENTED,
  EMPTY_PARAGRAPH,
} from "./fixtures/paragraphs";
import { segmentParagraph, isSegmented } from "@/utils/word-segmentation";

function setup(html: string): HTMLParagraphElement {
  document.body.innerHTML = html;
  return document.querySelector("p")!;
}

function getWordSpans(p: HTMLParagraphElement): HTMLSpanElement[] {
  return Array.from(p.querySelectorAll(".mirlo-word"));
}

function getOriginals(p: HTMLParagraphElement): string[] {
  return getWordSpans(p).map((s) => s.dataset.mirloOriginal!);
}

describe("segmentParagraph", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("wraps each word in a span with mirlo-word class", () => {
    const p = setup(PLAIN_PARAGRAPH);
    segmentParagraph(p);
    const words = getWordSpans(p);
    expect(words.length).toBeGreaterThan(0);
    words.forEach((span) => {
      expect(span.classList.contains("mirlo-word")).toBe(true);
    });
  });

  it("stores original word in data-mirlo-original", () => {
    const p = setup(PLAIN_PARAGRAPH);
    segmentParagraph(p);
    const originals = getOriginals(p);
    expect(originals).toContain("quick");
    expect(originals).toContain("fox");
    expect(originals).toContain("dog");
  });

  it("preserves visible text content", () => {
    const p = setup(PLAIN_PARAGRAPH);
    const textBefore = p.textContent;
    segmentParagraph(p);
    expect(p.textContent).toBe(textBefore);
  });

  it("preserves nested bold elements", () => {
    const p = setup(NESTED_INLINE);
    segmentParagraph(p);
    const strong = p.querySelector("strong");
    expect(strong).not.toBeNull();
    const wordsInStrong = strong!.querySelectorAll(".mirlo-word");
    expect(wordsInStrong.length).toBeGreaterThan(0);
  });

  it("preserves nested italic elements", () => {
    const p = setup(NESTED_INLINE);
    segmentParagraph(p);
    const em = p.querySelector("em");
    expect(em).not.toBeNull();
    const wordsInEm = em!.querySelectorAll(".mirlo-word");
    expect(wordsInEm.length).toBeGreaterThan(0);
  });

  it("skips words inside links", () => {
    const p = setup(WITH_LINK);
    segmentParagraph(p);
    const link = p.querySelector("a");
    expect(link).not.toBeNull();
    expect(link!.getAttribute("href")).toBe("/article");
    const wordsInLink = link!.querySelectorAll(".mirlo-word");
    expect(wordsInLink.length).toBe(0);
    // Link text should remain untouched
    expect(link!.textContent).toBe("full article about language learning");
  });

  it("skips words inside links even with nested inline elements", () => {
    const p = setup(DEEPLY_NESTED);
    segmentParagraph(p);
    const link = p.querySelector("a");
    expect(link).not.toBeNull();
    const wordsInLink = link!.querySelectorAll(".mirlo-word");
    expect(wordsInLink.length).toBe(0);
    // Words outside the link should still be segmented
    const allWords = getWordSpans(p);
    expect(allWords.length).toBeGreaterThan(0);
  });

  it("handles multiple inline elements", () => {
    const p = setup(MIXED_INLINE);
    segmentParagraph(p);
    expect(p.querySelector("strong .mirlo-word")).not.toBeNull();
    expect(p.querySelector("em .mirlo-word")).not.toBeNull();
    expect(p.querySelector("span .mirlo-word")).not.toBeNull();
  });

  it("handles single-word paragraph", () => {
    const p = setup(SINGLE_WORD);
    segmentParagraph(p);
    const words = getWordSpans(p);
    expect(words.length).toBe(1);
    expect(words[0].textContent).toBe("Hello");
  });

  it("handles punctuation attached to words", () => {
    const p = setup(WITH_PUNCTUATION);
    segmentParagraph(p);
    const originals = getOriginals(p);
    // Punctuation should stay attached or be handled gracefully
    expect(originals.length).toBeGreaterThan(0);
    // The visible text should remain the same
    expect(p.textContent).toBe(
      "Well, the students asked: why? Because learning matters—always.",
    );
  });

  it("excludes mirlo-badge content from segmentation", () => {
    const p = setup(WITH_BADGE);
    segmentParagraph(p);
    const badge = p.querySelector(".mirlo-badge");
    expect(badge).not.toBeNull();
    // Badge text should not be wrapped in mirlo-word
    const badgeWords = badge!.querySelectorAll(".mirlo-word");
    expect(badgeWords.length).toBe(0);
  });

  it("is idempotent — does not re-segment already segmented paragraphs", () => {
    const p = setup(ALREADY_SEGMENTED);
    segmentParagraph(p);
    const words = getWordSpans(p);
    expect(words.length).toBe(2);
  });

  it("handles empty paragraph", () => {
    const p = setup(EMPTY_PARAGRAPH);
    segmentParagraph(p);
    const words = getWordSpans(p);
    expect(words.length).toBe(0);
  });
});

describe("isSegmented", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("returns false for unsegmented paragraph", () => {
    const p = setup(PLAIN_PARAGRAPH);
    expect(isSegmented(p)).toBe(false);
  });

  it("returns true for segmented paragraph", () => {
    const p = setup(ALREADY_SEGMENTED);
    expect(isSegmented(p)).toBe(true);
  });

  it("returns true after segmentParagraph is called", () => {
    const p = setup(PLAIN_PARAGRAPH);
    segmentParagraph(p);
    expect(isSegmented(p)).toBe(true);
  });
});
