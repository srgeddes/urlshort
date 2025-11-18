import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateSlug } from "@/lib/slug";
import { normalizeUrl } from "@/lib/url";

const MAX_SLUG_ATTEMPTS = 5;

export async function POST(request: Request) {
  try {
    const { url } = (await request.json()) as { url?: unknown };

    if (typeof url !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid url field" },
        { status: 400 },
      );
    }

    let normalized: string;

    try {
      normalized = normalizeUrl(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    let slug: string | null = null;

    for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt += 1) {
      const candidate = generateSlug();
      const existing = await prisma.shortUrl.findUnique({
        where: { slug: candidate },
      });

      if (!existing) {
        slug = candidate;
        break;
      }
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Could not generate unique slug" },
        { status: 500 },
      );
    }

    const created = await prisma.shortUrl.create({
      data: {
        slug,
        originalUrl: normalized,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      return NextResponse.json(
        { error: "Base URL is not configured" },
        { status: 500 },
      );
    }

    const shortUrl = `${baseUrl.replace(/\/$/, "")}/${created.slug}`;

    return NextResponse.json(
      {
        slug: created.slug,
        originalUrl: created.originalUrl,
        shortUrl,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating short URL", error);

    return NextResponse.json(
      { error: "Something went wrong, please try again" },
      { status: 500 },
    );
  }
}

