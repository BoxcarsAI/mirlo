// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import {
  getHtmlLanguage,
  getNormalizedPageLanguage,
  getLanguagePairForPage,
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

  it("returns native->learning when page matches native language", () => {
    document.documentElement.lang = "en";
    const pair = getLanguagePairForPage("en", "es");
    expect(pair).toEqual({ sourceLanguage: "en", targetLanguage: "es" });
  });

  it("returns learning->native when page matches learning language", () => {
    document.documentElement.lang = "es";
    const pair = getLanguagePairForPage("en", "es");
    expect(pair).toEqual({ sourceLanguage: "es", targetLanguage: "en" });
  });

  it("returns null when page language matches neither", () => {
    document.documentElement.lang = "fr";
    const pair = getLanguagePairForPage("en", "es");
    expect(pair).toBeNull();
  });

  it("returns null when no page language is set", () => {
    const pair = getLanguagePairForPage("en", "es");
    expect(pair).toBeNull();
  });

  it("normalizes BCP47 tags before comparison", () => {
    document.documentElement.lang = "en-US";
    const pair = getLanguagePairForPage("en", "de");
    expect(pair).toEqual({ sourceLanguage: "en", targetLanguage: "de" });
  });

  it("handles different language pairs", () => {
    document.documentElement.lang = "fr";
    const pair = getLanguagePairForPage("fr", "de");
    expect(pair).toEqual({ sourceLanguage: "fr", targetLanguage: "de" });
  });
});
