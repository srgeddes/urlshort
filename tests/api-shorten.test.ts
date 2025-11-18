import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/shorten/route";

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
        create: vi.fn(
          async ({ data }: { data: { slug: string; originalUrl: string } }) => {
            const record: ShortUrlRecord = {
              id: records.length + 1,
              slug: data.slug,
              originalUrl: data.originalUrl,
              createdAt: new Date(),
              clickCount: 0,
            };
            records.push(record);
            return record;
          },
        ),
      },
    },
  };
});

describe("POST /api/shorten", () => {
  beforeEach(() => {
    records.length = 0;
    process.env.NEXT_PUBLIC_BASE_URL = "http://localhost:3000";
  });

  it("creates a short URL for a valid request", async () => {
    const body = JSON.stringify({ url: "https://example.com" });
    const request = new Request("http://localhost:3000/api/shorten", {
      method: "POST",
      body,
    });

    const response = await POST(request);
    expect(response.status).toBe(201);

    const data = (await response.json()) as {
      slug: string;
      originalUrl: string;
      shortUrl: string;
    };

    expect(data.originalUrl).toBe("https://example.com");
    expect(data.slug).toHaveLength(6);
    expect(data.shortUrl).toBe(
      `http://localhost:3000/${data.slug}`,
    );

    expect(records).toHaveLength(1);
    expect(records[0].slug).toBe(data.slug);
  });

  it("returns 400 for invalid URL", async () => {
    const body = JSON.stringify({ url: "not a url" });
    const request = new Request("http://localhost:3000/api/shorten", {
      method: "POST",
      body,
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = (await response.json()) as { error: string };
    expect(data.error).toBe("Invalid URL");
  });
});

