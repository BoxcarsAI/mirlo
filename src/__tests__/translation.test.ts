// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import {
  getHtmlLanguage,
  getNormalizedPageLanguage,
  getLanguagePairForPage,
  getLanguagePairForText,
  type LanguageDetector,
} from "@/utils/translation";

describe("getHtmlLanguage", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("lang");
    document.head.innerHTML = "";
  });

  it("returns lang attribute from html element", () => {
    document.documentElement.lang = "en";
    expect(getHtmlLanguage()).toBe("en");
  });

  it("returns full BCP47 tag", () => {
    document.documentElement.lang = "en-US";
    expect(getHtmlLanguage()).toBe("en-US");
  });

  it("trims whitespace", () => {
    document.documentElement.lang = "  fr  ";
    expect(getHtmlLanguage()).toBe("fr");
  });

  it("falls back to meta http-equiv content-language", () => {
    document.head.innerHTML = '<meta http-equiv="content-language" content="de">';
    expect(getHtmlLanguage()).toBe("de");
  });

  it("falls back to meta name=language", () => {
    document.head.innerHTML = '<meta name="language" content="ja">';
    expect(getHtmlLanguage()).toBe("ja");
  });

  it("returns empty string when no language info exists", () => {
    expect(getHtmlLanguage()).toBe("");
  });

  it("prefers html lang over meta tags", () => {
    document.documentElement.lang = "es";
    document.head.innerHTML = '<meta http-equiv="content-language" content="fr">';
    expect(getHtmlLanguage()).toBe("es");
  });
});

describe("getNormalizedPageLanguage", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("lang");
    document.head.innerHTML = "";
  });

  it("normalizes en-US to en", () => {
    document.documentElement.lang = "en-US";
    expect(getNormalizedPageLanguage()).toBe("en");
  });

  it("lowercases language code", () => {
    document.documentElement.lang = "FR";
    expect(getNormalizedPageLanguage()).toBe("fr");
  });

  it("returns empty string when no language set", () => {
    expect(getNormalizedPageLanguage()).toBe("");
  });

  it("handles simple language codes", () => {
    document.documentElement.lang = "de";
    expect(getNormalizedPageLanguage()).toBe("de");
  });
});

describe("getLanguagePairForPage", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("lang");
  });

  it("translates a non-target page into the target language", () => {
    document.documentElement.lang = "en";
    const pair = getLanguagePairForPage("es");
    expect(pair).toEqual({ sourceLanguage: "en", targetLanguage: "es" });
  });

  it("works for any source language, not just a preconfigured pair", () => {
    document.documentElement.lang = "de";
    const pair = getLanguagePairForPage("hi");
    expect(pair).toEqual({ sourceLanguage: "de", targetLanguage: "hi" });
  });

  it("returns null when the page is already in the target language", () => {
    document.documentElement.lang = "es";
    const pair = getLanguagePairForPage("es");
    expect(pair).toBeNull();
  });

  it("returns null when no page language is set", () => {
    const pair = getLanguagePairForPage("es");
    expect(pair).toBeNull();
  });

  it("normalizes BCP47 tags before comparison", () => {
    document.documentElement.lang = "en-US";
    const pair = getLanguagePairForPage("de");
    expect(pair).toEqual({ sourceLanguage: "en", targetLanguage: "de" });
  });

  it("treats a normalized page tag matching the target as already-target", () => {
    document.documentElement.lang = "es-MX";
    const pair = getLanguagePairForPage("es");
    expect(pair).toBeNull();
  });
});

function fakeDetector(lang: string, confidence = 0.95): LanguageDetector {
  return {
    detect: async () => [{ detectedLanguage: lang, confidence }],
  };
}

describe("getLanguagePairForText", () => {
  it("translates detected non-target text into the target language", async () => {
    const pair = await getLanguagePairForText(
      "The quick brown fox",
      "es",
      fakeDetector("en"),
    );
    expect(pair).toEqual({ sourceLanguage: "en", targetLanguage: "es" });
  });

  it("works for any detected source language", async () => {
    const pair = await getLanguagePairForText(
      "Le petit chat dort tranquillement",
      "hi",
      fakeDetector("fr"),
    );
    expect(pair).toEqual({ sourceLanguage: "fr", targetLanguage: "hi" });
  });

  it("returns null when detected text is already in the target language", async () => {
    const pair = await getLanguagePairForText(
      "El gato negro duerme",
      "es",
      fakeDetector("es"),
    );
    expect(pair).toBeNull();
  });

  it("returns null when confidence is too low", async () => {
    const pair = await getLanguagePairForText(
      "ambiguous text",
      "es",
      fakeDetector("en", 0.3),
    );
    expect(pair).toBeNull();
  });

  it("returns null when detector returns empty results", async () => {
    const detector: LanguageDetector = { detect: async () => [] };
    const pair = await getLanguagePairForText("some text", "es", detector);
    expect(pair).toBeNull();
  });

  it("returns null when detector throws", async () => {
    const detector: LanguageDetector = {
      detect: async () => { throw new Error("API error"); },
    };
    const pair = await getLanguagePairForText("some text", "es", detector);
    expect(pair).toBeNull();
  });

  it("returns null when text is too short", async () => {
    const pair = await getLanguagePairForText(
      "hi",
      "es",
      fakeDetector("en"),
    );
    expect(pair).toBeNull();
  });

  it("handles Reddit scenario: English page with Spanish content while learning Spanish", async () => {
    // Page chrome is English but this paragraph is actually Spanish → already target, skip
    const pair = await getLanguagePairForText(
      "Hola amigos, estoy buscando recomendaciones para restaurantes en Granada",
      "es",
      fakeDetector("es", 0.97),
    );
    expect(pair).toBeNull();
  });
});
