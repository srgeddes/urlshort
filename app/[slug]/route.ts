import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type RouteContext = {
  params: {
    slug: string;
  };
};

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<Response> {
  const slug = context.params.slug;

  if (!slug || typeof slug !== "string") {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const record = await prisma.shortUrl.findUnique({
      where: { slug },
    });

    if (!record) {
      return new NextResponse(
        "<html><body><h1>Short URL not found</h1><p>The requested link does not exist.</p></body></html>",
        {
          status: 404,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        },
      );
    }

    try {
      await prisma.shortUrl.update({
        where: { id: record.id },
        data: { clickCount: { increment: 1 } },
      });
    } catch (error) {
      console.error("Error updating click count", error);
    }

    return NextResponse.redirect(record.originalUrl, {
      status: 302,
    });
  } catch (error) {
    console.error("Error handling redirect", error);

    return new NextResponse(
      "<html><body><h1>Server error</h1><p>Something went wrong, please try again later.</p></body></html>",
      {
        status: 500,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      },
    );
  }
}

