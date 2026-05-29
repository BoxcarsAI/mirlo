import { describe, it, expect } from "vitest";
import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANGUAGE_CODES,
  isSupportedLanguage,
  getLanguageInfo,
  getLanguageLabel,
} from "@/utils/languages";

describe("SUPPORTED_LANGUAGES table", () => {
  it("covers all 39 Chrome Translator API languages", () => {
    expect(SUPPORTED_LANGUAGES).toHaveLength(39);
  });

  it("has unique language codes", () => {
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("keeps the original four languages", () => {
    for (const code of ["en", "es", "fr", "de"]) {
      expect(SUPPORTED_LANGUAGE_CODES).toContain(code);
    }
  });

  it("includes newly enabled languages", () => {
    for (const code of ["ja", "ko", "ar", "hi", "zh", "zh-Hant"]) {
      expect(SUPPORTED_LANGUAGE_CODES).toContain(code);
    }
  });

  it("gives every language an English name and a native name", () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(lang.english.length).toBeGreaterThan(0);
      expect(lang.native.length).toBeGreaterThan(0);
    }
  });
});

describe("isSupportedLanguage", () => {
  it("returns true for a supported code", () => {
    expect(isSupportedLanguage("ja")).toBe(true);
  });

  it("returns false for an unsupported code", () => {
    expect(isSupportedLanguage("xx")).toBe(false);
  });

  it("returns false for empty input", () => {
    expect(isSupportedLanguage("")).toBe(false);
  });
});

describe("getLanguageInfo", () => {
  it("returns the entry for a known code", () => {
    expect(getLanguageInfo("de")?.english).toBe("German");
  });

  it("returns undefined for an unknown code", () => {
    expect(getLanguageInfo("xx")).toBeUndefined();
  });
});

describe("getLanguageLabel", () => {
  it("shows both the English and native name", () => {
    const label = getLanguageLabel("ja");
    expect(label).toContain("Japanese");
    expect(label).toContain("日本語");
  });

  it("does not duplicate the name when English and native match", () => {
    const label = getLanguageLabel("en");
    expect(label).toBe("English");
  });

  it("falls back to the uppercased code for unknown languages", () => {
    expect(getLanguageLabel("xx")).toBe("XX");
  });
});
