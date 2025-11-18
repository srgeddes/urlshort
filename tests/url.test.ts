import { describe, expect, it } from "vitest";
import { isValidUrl, normalizeUrl } from "@/lib/url";

describe("isValidUrl", () => {
  it("returns false for empty or whitespace", () => {
    expect(isValidUrl("")).toBe(false);
    expect(isValidUrl("   ")).toBe(false);
  });

  it("accepts http and https URLs", () => {
    expect(isValidUrl("http://example.com")).toBe(true);
    expect(isValidUrl("https://example.com/path?query=1")).toBe(true);
  });

  it("rejects unsupported schemes", () => {
    expect(isValidUrl("ftp://example.com")).toBe(false);
    expect(isValidUrl("javascript:alert('xss')")).toBe(false);
  });
});

describe("normalizeUrl", () => {
  it("throws for empty input", () => {
    expect(() => normalizeUrl("")).toThrow();
  });

  it("keeps valid http/https URLs unchanged", () => {
    const original = "https://example.com/path";
    expect(normalizeUrl(original)).toBe(original);
  });

  it("adds https scheme when missing", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com");
    expect(normalizeUrl("www.example.com/path")).toBe(
      "https://www.example.com/path",
    );
  });

  it("throws for invalid URLs", () => {
    expect(() => normalizeUrl("not a url")).toThrow();
  });

  it("rejects javascript URLs even after normalization", () => {
    expect(() => normalizeUrl("javascript:alert('xss')")).toThrow();
  });
});

