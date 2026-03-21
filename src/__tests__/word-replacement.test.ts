// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { PLAIN_PARAGRAPH, NESTED_INLINE } from "./fixtures/paragraphs";
import { segmentParagraph } from "@/utils/word-segmentation";
import {
  replaceWord,
  revertWord,
  replaceWordsInParagraph,
  revertWordsInParagraph,
} from "@/utils/word-replacement";

function setup(html: string): HTMLParagraphElement {
  document.body.innerHTML = html;
  const p = document.querySelector("p")!;
  segmentParagraph(p);
  return p;
}

function findWord(p: HTMLParagraphElement, original: string): HTMLSpanElement | null {
  return p.querySelector(`.mirlo-word[data-mirlo-original="${original}"]`);
}

describe("replaceWord", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("replaces word text with translation", () => {
    const p = setup(PLAIN_PARAGRAPH);
    const span = findWord(p, "fox")!;
    replaceWord(span, "zorro");
    expect(span.textContent).toBe("zorro");
  });

  it("adds mirlo-word-translated class", () => {
    const p = setup(PLAIN_PARAGRAPH);
    const span = findWord(p, "fox")!;
    replaceWord(span, "zorro");
    expect(span.classList.contains("mirlo-word-translated")).toBe(true);
  });

  it("sets title attribute to original word", () => {
    const p = setup(PLAIN_PARAGRAPH);
    const span = findWord(p, "fox")!;
    replaceWord(span, "zorro");
    expect(span.title).toBe("fox");
  });

  it("preserves data-mirlo-original", () => {
    const p = setup(PLAIN_PARAGRAPH);
    const span = findWord(p, "fox")!;
    replaceWord(span, "zorro");
    expect(span.dataset.mirloOriginal).toBe("fox");
  });
});

describe("revertWord", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("restores original text", () => {
    const p = setup(PLAIN_PARAGRAPH);
    const span = findWord(p, "fox")!;
    replaceWord(span, "zorro");
    revertWord(span);
    expect(span.textContent).toBe("fox");
  });

  it("removes mirlo-word-translated class", () => {
    const p = setup(PLAIN_PARAGRAPH);
    const span = findWord(p, "fox")!;
    replaceWord(span, "zorro");
    revertWord(span);
    expect(span.classList.contains("mirlo-word-translated")).toBe(false);
  });

  it("removes title attribute", () => {
    const p = setup(PLAIN_PARAGRAPH);
    const span = findWord(p, "fox")!;
    replaceWord(span, "zorro");
    revertWord(span);
    expect(span.title).toBe("");
  });
});

describe("replaceWordsInParagraph", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("replaces multiple words from a translation map", () => {
    const p = setup(PLAIN_PARAGRAPH);
    const wordMap = new Map([
      ["quick", "rápido"],
      ["fox", "zorro"],
      ["dog", "perro"],
    ]);
    replaceWordsInParagraph(p, wordMap);
    expect(findWord(p, "quick")!.textContent).toBe("rápido");
    expect(findWord(p, "fox")!.textContent).toBe("zorro");
    expect(findWord(p, "dog")!.textContent).toBe("perro");
  });

  it("leaves words not in the map untouched", () => {
    const p = setup(PLAIN_PARAGRAPH);
    const wordMap = new Map([["fox", "zorro"]]);
    replaceWordsInParagraph(p, wordMap);
    expect(findWord(p, "quick")!.textContent).toBe("quick");
    expect(findWord(p, "lazy")!.textContent).toBe("lazy");
  });

  it("works with nested HTML elements", () => {
    const p = setup(NESTED_INLINE);
    const wordMap = new Map([
      ["old", "vieja"],
      ["beautiful", "hermoso"],
    ]);
    replaceWordsInParagraph(p, wordMap);
    // "old" is inside <strong>
    const strong = p.querySelector("strong");
    const oldWord = strong!.querySelector('.mirlo-word[data-mirlo-original="old"]');
    expect(oldWord!.textContent).toBe("vieja");
    // "beautiful" is inside <em>
    const em = p.querySelector("em");
    const beautifulWord = em!.querySelector('.mirlo-word[data-mirlo-original="beautiful"]');
    expect(beautifulWord!.textContent).toBe("hermoso");
  });
});

describe("revertWordsInParagraph", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("reverts all translated words in a paragraph", () => {
    const p = setup(PLAIN_PARAGRAPH);
    const wordMap = new Map([
      ["quick", "rápido"],
      ["fox", "zorro"],
    ]);
    replaceWordsInParagraph(p, wordMap);
    revertWordsInParagraph(p);
    expect(findWord(p, "quick")!.textContent).toBe("quick");
    expect(findWord(p, "fox")!.textContent).toBe("fox");
  });

  it("removes translated class from all words", () => {
    const p = setup(PLAIN_PARAGRAPH);
    const wordMap = new Map([
      ["quick", "rápido"],
      ["fox", "zorro"],
    ]);
    replaceWordsInParagraph(p, wordMap);
    revertWordsInParagraph(p);
    const translated = p.querySelectorAll(".mirlo-word-translated");
    expect(translated.length).toBe(0);
  });

  it("clears word translations before paragraph mode (simulates badge click)", () => {
    const p = setup(PLAIN_PARAGRAPH);
    const wordMap = new Map([
      ["quick", "rápido"],
      ["fox", "zorro"],
      ["dog", "perro"],
    ]);
    replaceWordsInParagraph(p, wordMap);

    // Verify words are translated
    expect(findWord(p, "fox")!.textContent).toBe("zorro");
    expect(p.querySelectorAll(".mirlo-word-translated").length).toBe(3);

    // Revert words (as paragraph mode would)
    revertWordsInParagraph(p);

    // All words should be back to original
    expect(findWord(p, "quick")!.textContent).toBe("quick");
    expect(findWord(p, "fox")!.textContent).toBe("fox");
    expect(findWord(p, "dog")!.textContent).toBe("dog");
    expect(p.querySelectorAll(".mirlo-word-translated").length).toBe(0);
  });

  it("is a no-op when no words are translated", () => {
    const p = setup(PLAIN_PARAGRAPH);
    // No translations applied — revert should not throw or change anything
    revertWordsInParagraph(p);
    expect(findWord(p, "quick")!.textContent).toBe("quick");
  });
});
