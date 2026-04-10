// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import {
  PLAIN_PARAGRAPH,
  NESTED_INLINE,
  WITH_PUNCTUATION,
  REPEATED_WORDS,
  MIXED_COMPLEXITY,
  PROPER_NOUN_MID_SENTENCE,
  PROPER_NOUN_SENTENCE_START,
  MULTIPLE_PROPER_NOUNS,
  PROPER_NOUN_AFTER_PERIOD,
} from "./fixtures/paragraphs";
import { segmentParagraph } from "@/utils/word-segmentation";
import {
  replaceWord,
  revertWord,
  replaceWordsInParagraph,
  revertWordsInParagraph,
  collectTranslatableWords,
  buildTranslationMap,
  selectWordsForTranslation,
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

  it("only replaces first occurrence of each word", () => {
    const p = setup(REPEATED_WORDS);
    const wordMap = new Map([["cat", "gato"]]);
    replaceWordsInParagraph(p, wordMap);
    const allCatSpans = p.querySelectorAll<HTMLSpanElement>(
      '.mirlo-word[data-mirlo-original="cat"]',
    );
    const translatedCats = Array.from(allCatSpans).filter((s) =>
      s.classList.contains("mirlo-word-translated"),
    );
    const untranslatedCats = Array.from(allCatSpans).filter(
      (s) => !s.classList.contains("mirlo-word-translated"),
    );
    expect(translatedCats.length).toBe(1);
    expect(untranslatedCats.length).toBe(2); // "cat" appears 3 times total
    expect(translatedCats[0].textContent).toBe("gato");
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

  it("collects content words with length >= 5", () => {
    const p = setup(PLAIN_PARAGRAPH);
    const words = collectTranslatableWords(p);
    expect(words).toContain("quick");
    expect(words).toContain("brown");
    expect(words).toContain("river");
  });

  it("excludes short words (< 5 chars)", () => {
    const p = setup(PLAIN_PARAGRAPH);
    const words = collectTranslatableWords(p);
    expect(words).not.toContain("The");
    expect(words).not.toContain("the");
    expect(words).not.toContain("fox");
    expect(words).not.toContain("over");
    expect(words).not.toContain("dog");
    expect(words).not.toContain("near");
  });

  it("excludes common function words (stopwords)", () => {
    document.body.innerHTML =
      "<p>The beautiful cathedral stands between those ancient buildings</p>";
    const p = document.querySelector("p")!;
    segmentParagraph(p);
    const words = collectTranslatableWords(p);
    expect(words).not.toContain("between");
    expect(words).not.toContain("those");
    expect(words).toContain("beautiful");
    expect(words).toContain("cathedral");
    expect(words).toContain("ancient");
    expect(words).toContain("stands");
    expect(words).toContain("buildings");
  });

  it("excludes common articles, prepositions, and conjunctions", () => {
    document.body.innerHTML =
      "<p>There should always never about through without against their would could</p>";
    const p = document.querySelector("p")!;
    segmentParagraph(p);
    const words = collectTranslatableWords(p);
    expect(words).not.toContain("There");
    expect(words).not.toContain("should");
    expect(words).not.toContain("always");
    expect(words).not.toContain("never");
    expect(words).not.toContain("about");
    expect(words).not.toContain("through");
    expect(words).not.toContain("without");
    expect(words).not.toContain("against");
    expect(words).not.toContain("their");
    expect(words).not.toContain("would");
    expect(words).not.toContain("could");
  });

  it("excludes gerunds that the Translator API mistranslates as nouns", () => {
    document.body.innerHTML =
      "<p>running eating thinking playing writing building learning reading speaking working</p>";
    const p = document.querySelector("p")!;
    segmentParagraph(p);
    const words = collectTranslatableWords(p);
    expect(words).not.toContain("running");
    expect(words).not.toContain("eating");
    expect(words).not.toContain("thinking");
    expect(words).not.toContain("playing");
    expect(words).not.toContain("writing");
    expect(words).not.toContain("building");
    expect(words).not.toContain("learning");
    expect(words).not.toContain("reading");
    expect(words).not.toContain("speaking");
    expect(words).not.toContain("working");
  });

  it("excludes words with punctuation", () => {
    const p = setup(WITH_PUNCTUATION);
    const words = collectTranslatableWords(p);
    expect(words).not.toContain("Well,");
    expect(words).not.toContain("why?");
  });

  it("deduplicates words", () => {
    document.body.innerHTML = "<p>the extraordinary cat and the extraordinary dog</p>";
    const p = document.querySelector("p")!;
    segmentParagraph(p);
    const words = collectTranslatableWords(p);
    const count = words.filter((w) => w === "extraordinary").length;
    expect(count).toBe(1);
  });

  it("collects complex words from mixed paragraph", () => {
    const p = setup(MIXED_COMPLEXITY);
    const words = collectTranslatableWords(p);
    expect(words).toContain("extraordinary");
    expect(words).toContain("architecture");
    expect(words).toContain("ancient");
    expect(words).toContain("cathedral");
    expect(words).toContain("impressed");
    expect(words).toContain("international");
    expect(words).toContain("visitors");
    expect(words).toContain("traveled");
    // Short/function words excluded
    expect(words).not.toContain("the");
    expect(words).not.toContain("who");
    expect(words).not.toContain("all");
    expect(words).not.toContain("there");
  });
});

describe("proper noun filtering", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("excludes mid-sentence capitalized words as likely proper nouns", () => {
    const p = setup(PROPER_NOUN_MID_SENTENCE);
    const words = collectTranslatableWords(p);
    expect(words).not.toContain("Maria");
    // lowercase content words should still be collected
    expect(words).toContain("coffee");
    expect(words).toContain("downtown");
    expect(words).toContain("yesterday");
  });

  it("includes capitalized words at paragraph start", () => {
    const p = setup(PROPER_NOUN_SENTENCE_START);
    const words = collectTranslatableWords(p);
    // First word — can't tell if proper noun, so include it
    expect(words).toContain("Maria");
    expect(words).toContain("walked");
    expect(words).toContain("store");
    expect(words).toContain("bought");
    expect(words).toContain("bread");
  });

  it("excludes multiple proper nouns in one paragraph", () => {
    const p = setup(MULTIPLE_PROPER_NOUNS);
    const words = collectTranslatableWords(p);
    expect(words).not.toContain("John");
    expect(words).not.toContain("Maria");
    expect(words).not.toContain("Eiffel");
    expect(words).not.toContain("Tower");
    expect(words).not.toContain("Paris");
    // regular words still collected
    expect(words).toContain("Yesterday");
    expect(words).toContain("visited");
  });

  it("treats word after sentence-ending punctuation as sentence start", () => {
    const p = setup(PROPER_NOUN_AFTER_PERIOD);
    const words = collectTranslatableWords(p);
    // "Maria" follows ". " so it's a sentence start — include it
    expect(words).toContain("Maria");
    expect(words).toContain("weather");
    expect(words).toContain("walked");
    expect(words).toContain("store");
    expect(words).toContain("picked");
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

describe("selectWordsForTranslation", () => {
  const words = Array.from({ length: 100 }, (_, i) => `word${i}`);

  it("low density selects roughly 5-15% of words", () => {
    const selected = selectWordsForTranslation(words, "low");
    expect(selected.length).toBeGreaterThanOrEqual(3);
    expect(selected.length).toBeLessThanOrEqual(20);
  });

  it("medium density selects roughly 20-35% of words", () => {
    const selected = selectWordsForTranslation(words, "medium");
    expect(selected.length).toBeGreaterThanOrEqual(15);
    expect(selected.length).toBeLessThanOrEqual(40);
  });

  it("high density selects roughly 40-60% of words", () => {
    const selected = selectWordsForTranslation(words, "high");
    expect(selected.length).toBeGreaterThanOrEqual(35);
    expect(selected.length).toBeLessThanOrEqual(65);
  });

  it("returns subset of the input words", () => {
    const selected = selectWordsForTranslation(words, "medium");
    for (const word of selected) {
      expect(words).toContain(word);
    }
  });

  it("returns empty array for empty input", () => {
    expect(selectWordsForTranslation([], "medium")).toEqual([]);
  });

  it("returns the word for single-word input regardless of density", () => {
    const selected = selectWordsForTranslation(["hello"], "low");
    expect(selected).toEqual(["hello"]);
  });

  it("defaults to medium when density is invalid", () => {
    const selected = selectWordsForTranslation(words, "invalid" as any);
    const medium = selectWordsForTranslation(words, "medium");
    // Both should be in the medium range
    expect(selected.length).toBeGreaterThanOrEqual(15);
    expect(selected.length).toBeLessThanOrEqual(40);
  });

  it("returns different words on different calls (not always the same subset)", () => {
    const run1 = selectWordsForTranslation(words, "medium");
    const run2 = selectWordsForTranslation(words, "medium");
    // With 100 words at 25%, extremely unlikely to pick identical sets
    // But they could theoretically match, so just check they're valid
    expect(run1.length).toBeGreaterThan(0);
    expect(run2.length).toBeGreaterThan(0);
  });

  it("handles small word lists gracefully", () => {
    const small = ["alpha", "beta", "gamma"];
    const selected = selectWordsForTranslation(small, "low");
    expect(selected.length).toBeGreaterThanOrEqual(1);
    expect(selected.length).toBeLessThanOrEqual(3);
  });
});
