import { describe, it, expect, beforeEach } from "vitest";
import { fakeBrowser } from "wxt/testing";
import { STORAGE_KEYS } from "@/utils/storage-keys";

describe("chrome.storage integration", () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  it("stores and retrieves language preferences", async () => {
    await chrome.storage.sync.set({
      [STORAGE_KEYS.nativeLanguage]: "fr",
      [STORAGE_KEYS.learningLanguage]: "de",
    });

    const result = await chrome.storage.sync.get([
      STORAGE_KEYS.nativeLanguage,
      STORAGE_KEYS.learningLanguage,
    ]);

    expect(result[STORAGE_KEYS.nativeLanguage]).toBe("fr");
    expect(result[STORAGE_KEYS.learningLanguage]).toBe("de");
  });

  it("stores and retrieves enabled domains", async () => {
    const domains = ["example.com", "blog.test.org"];
    await chrome.storage.sync.set({
      [STORAGE_KEYS.enabledDomains]: domains,
    });

    const result = await chrome.storage.sync.get([STORAGE_KEYS.enabledDomains]);
    expect(result[STORAGE_KEYS.enabledDomains]).toEqual(domains);
  });

  it("returns empty object for missing keys", async () => {
    const result = await chrome.storage.sync.get([STORAGE_KEYS.nativeLanguage]);
    expect(result[STORAGE_KEYS.nativeLanguage]).toBeUndefined();
  });

  it("reset clears all storage", async () => {
    await chrome.storage.sync.set({
      [STORAGE_KEYS.nativeLanguage]: "es",
    });

    fakeBrowser.reset();

    const result = await chrome.storage.sync.get([STORAGE_KEYS.nativeLanguage]);
    expect(result[STORAGE_KEYS.nativeLanguage]).toBeUndefined();
  });
});
