// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { PLAIN_PARAGRAPH, NESTED_INLINE, WITH_PUNCTUATION } from "./fixtures/paragraphs";
import { segmentParagraph } from "@/utils/word-segmentation";
import {
  replaceWord,
  revertWord,
  replaceWordsInParagraph,
  revertWordsInParagraph,
  collectTranslatableWords,
  buildTranslationMap,
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

  it("stores translation in data-mirlo-translation", () => {
    const p = setup(PLAIN_PARAGRAPH);
    const span = findWord(p, "fox")!;
    replaceWord(span, "zorro");
    expect(span.dataset.mirloTranslation).toBe("zorro");
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

  it("removes translation data attribute", () => {
    const p = setup(PLAIN_PARAGRAPH);
    const span = findWord(p, "fox")!;
    replaceWord(span, "zorro");
    revertWord(span);
    expect(span.dataset.mirloTranslation).toBeUndefined();
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

describe("collectTranslatableWords", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("collects unique words matching alpha pattern with length >= 3", () => {
    const p = setup(PLAIN_PARAGRAPH);
    const words = collectTranslatableWords(p);
    expect(words).toContain("quick");
    expect(words).toContain("brown");
    expect(words).toContain("fox");
    // "The" has length 3, should be included
    expect(words).toContain("The");
  });

  it("excludes short words (< 3 chars)", () => {
    // PLAIN_PARAGRAPH doesn't have 2-char words, so use a custom one
    document.body.innerHTML = "<p>I am so very happy today</p>";
    const p = document.querySelector("p")!;
    segmentParagraph(p);
    const words = collectTranslatableWords(p);
    expect(words).not.toContain("I");
    expect(words).not.toContain("am");
    expect(words).not.toContain("so");
    expect(words).toContain("very");
    expect(words).toContain("happy");
    expect(words).toContain("today");
  });

  it("excludes words with punctuation", () => {
    const p = setup(WITH_PUNCTUATION);
    const words = collectTranslatableWords(p);
    // "Well," has a comma — excluded
    expect(words).not.toContain("Well,");
    // "why?" has a question mark — excluded
    expect(words).not.toContain("why?");
    // Clean words should be included
    expect(words).toContain("the");
    expect(words).toContain("students");
  });

  it("deduplicates words", () => {
    document.body.innerHTML = "<p>the cat and the dog and the bird</p>";
    const p = document.querySelector("p")!;
    segmentParagraph(p);
    const words = collectTranslatableWords(p);
    const theCount = words.filter((w) => w === "the").length;
    expect(theCount).toBe(1);
  });
});

describe("buildTranslationMap", () => {
  it("builds a map from words using a translator", async () => {
    const fakeTranslator = {
      translate: async (word: string) => {
        const dict: Record<string, string> = { fox: "zorro", dog: "perro", cat: "gato" };
        return dict[word] || word;
      },
    };
    const map = await buildTranslationMap(["fox", "dog", "cat"], fakeTranslator);
    expect(map.get("fox")).toBe("zorro");
    expect(map.get("dog")).toBe("perro");
    expect(map.get("cat")).toBe("gato");
  });

  it("skips words where translation equals original (case-insensitive)", async () => {
    const fakeTranslator = {
      translate: async (word: string) => {
        // "Internet" translates to "Internet" — same word
        if (word === "Internet") return "Internet";
        return "translated_" + word;
      },
    };
    const map = await buildTranslationMap(["Internet", "hello"], fakeTranslator);
    expect(map.has("Internet")).toBe(false);
    expect(map.get("hello")).toBe("translated_hello");
  });

  it("skips words that throw during translation", async () => {
    const fakeTranslator = {
      translate: async (word: string) => {
        if (word === "broken") throw new Error("API error");
        return "ok_" + word;
      },
    };
    const map = await buildTranslationMap(["good", "broken", "fine"], fakeTranslator);
    expect(map.get("good")).toBe("ok_good");
    expect(map.has("broken")).toBe(false);
    expect(map.get("fine")).toBe("ok_fine");
  });

  it("returns empty map when all translations match originals", async () => {
    const fakeTranslator = {
      translate: async (word: string) => word,
    };
    const map = await buildTranslationMap(["hello", "world"], fakeTranslator);
    expect(map.size).toBe(0);
  });
});
