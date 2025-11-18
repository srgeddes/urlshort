import { describe, expect, it, vi, beforeEach } from "vitest";
import { GET } from "@/app/[slug]/route";

type ShortUrlRecord = {
  id: number;
  slug: string;
  originalUrl: string;
  createdAt: Date;
  clickCount: number;
};

const records: ShortUrlRecord[] = [];

vi.mock("@/lib/db", () => {
  return {
    prisma: {
      shortUrl: {
        findUnique: vi.fn(async ({ where }: { where: { slug: string } }) =>
          records.find((r) => r.slug === where.slug),
        ),
        update: vi.fn(
          async ({
            where,
            data,
          }: {
            where: { id: number };
            data: { clickCount: { increment: number } };
          }) => {
            const record = records.find((r) => r.id === where.id);
            if (!record) {
              throw new Error("Record not found");
            }
            record.clickCount += data.clickCount.increment;
            return record;
          },
        ),
      },
    },
  };
});

describe("GET /[slug]", () => {
  beforeEach(() => {
    records.length = 0;
  });

  it("redirects to the original URL when slug exists", async () => {
    records.push({
      id: 1,
      slug: "abc123",
      originalUrl: "https://example.com",
      createdAt: new Date(),
      clickCount: 0,
    });

    const request = new Request("http://localhost:3000/abc123");
    const response = await GET(request, { params: { slug: "abc123" } });

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toMatch(
      /^https:\/\/example\.com\/?$/,
    );
  });

  it("returns 404 when slug does not exist", async () => {
    const request = new Request("http://localhost:3000/missing");
    const response = await GET(request, { params: { slug: "missing" } });

    expect(response.status).toBe(404);
  });
});
