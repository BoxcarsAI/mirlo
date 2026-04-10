import { describe, it, expect } from "vitest";
import { getWordCount } from "@/utils/language";

describe("getWordCount", () => {
  it("counts words in a normal sentence", () => {
    expect(getWordCount("hello world foo bar")).toBe(4);
  });

  it("handles extra whitespace", () => {
    expect(getWordCount("  hello   world  ")).toBe(2);
  });

  it("returns 0 for empty string", () => {
    expect(getWordCount("")).toBe(0);
  });

  it("returns 0 for whitespace-only string", () => {
    expect(getWordCount("   ")).toBe(0);
  });

  it("counts single word", () => {
    expect(getWordCount("hello")).toBe(1);
  });

  it("handles tabs and newlines", () => {
    expect(getWordCount("hello\tworld\nfoo")).toBe(3);
  });
});
