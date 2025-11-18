import { describe, expect, it } from "vitest";
import { generateSlug } from "@/lib/slug";

describe("generateSlug", () => {
  it("generates a slug with default length 6", () => {
    const slug = generateSlug();
    expect(slug).toHaveLength(6);
  });

  it("uses only alphanumeric characters", () => {
    const slug = generateSlug(10);
    expect(/^[A-Za-z0-9]{10}$/.test(slug)).toBe(true);
  });

  it("respects custom length", () => {
    const length = 8;
    const slug = generateSlug(length);
    expect(slug).toHaveLength(length);
  });
});

