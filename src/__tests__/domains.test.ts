import { describe, it, expect } from "vitest";
import { normalizeDomain, normalizeDomainList, getDomainFromUrl } from "@/utils/domains";

describe("normalizeDomain", () => {
  it("strips www prefix", () => {
    expect(normalizeDomain("www.example.com")).toBe("example.com");
  });

  it("lowercases the hostname", () => {
    expect(normalizeDomain("Example.COM")).toBe("example.com");
  });

  it("strips www and lowercases together", () => {
    expect(normalizeDomain("WWW.Example.Com")).toBe("example.com");
  });

  it("returns empty string for empty input", () => {
    expect(normalizeDomain("")).toBe("");
  });

  it("leaves non-www subdomains intact", () => {
    expect(normalizeDomain("blog.example.com")).toBe("blog.example.com");
  });
});

describe("normalizeDomainList", () => {
  it("normalizes an array of domains", () => {
    expect(normalizeDomainList(["www.A.com", "B.org"])).toEqual(["a.com", "b.org"]);
  });

  it("filters out non-string entries", () => {
    expect(normalizeDomainList([42, null, "ok.com", undefined])).toEqual(["ok.com"]);
  });

  it("returns empty array for non-array input", () => {
    expect(normalizeDomainList(null)).toEqual([]);
    expect(normalizeDomainList("not an array")).toEqual([]);
    expect(normalizeDomainList(undefined)).toEqual([]);
  });

  it("filters out empty strings", () => {
    expect(normalizeDomainList(["", ""])).toEqual([]);
  });
});

describe("getDomainFromUrl", () => {
  it("extracts domain from http URL", () => {
    expect(getDomainFromUrl("http://www.example.com/path")).toBe("example.com");
  });

  it("extracts domain from https URL", () => {
    expect(getDomainFromUrl("https://blog.example.com")).toBe("blog.example.com");
  });

  it("returns empty for chrome:// URLs", () => {
    expect(getDomainFromUrl("chrome://extensions")).toBe("");
  });

  it("returns empty for undefined", () => {
    expect(getDomainFromUrl(undefined)).toBe("");
  });

  it("returns empty for empty string", () => {
    expect(getDomainFromUrl("")).toBe("");
  });

  it("returns empty for malformed URLs", () => {
    expect(getDomainFromUrl("not a url")).toBe("");
  });
});
