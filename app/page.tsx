'use client';

import { useState } from "react";
import { LayoutShell } from "@/components/LayoutShell";
import { UrlShortenerForm } from "@/components/UrlShortenerForm";
import { ShortUrlResult } from "@/components/ShortUrlResult";

type ShortenResult = {
  slug: string;
  originalUrl: string;
  shortUrl: string;
};

export default function Home() {
  const [latest, setLatest] = useState<ShortenResult | null>(null);
  const [recent, setRecent] = useState<ShortenResult[]>([]);

  function handleShorten(result: ShortenResult) {
    setLatest(result);
    setRecent((prev) => [result, ...prev].slice(0, 5));
  }

  return (
    <LayoutShell>
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Shorten your links
        </h1>
        <p className="text-sm text-slate-600 sm:text-base">
          Paste any long URL and get a clean, shareable link in seconds.
        </p>
      </header>

      <UrlShortenerForm onShorten={handleShorten} />

      {latest && (
        <ShortUrlResult
          shortUrl={latest.shortUrl}
          originalUrl={latest.originalUrl}
        />
      )}

      {recent.length > 1 && (
        <section
          aria-label="Recently shortened links"
          className="mt-8 border-t border-slate-200 pt-4"
        >
          <h2 className="text-sm font-semibold text-slate-800">
            Recent links (this session)
          </h2>
          <ul className="mt-2 space-y-2">
            {recent.slice(1).map((item) => (
              <li
                key={item.slug}
                className="flex flex-col gap-1 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-700 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">
                    <a
                      href={item.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-700 hover:underline"
                    >
                      {item.shortUrl}
                    </a>
                  </p>
                  <p className="truncate text-[11px] text-slate-500">
                    {item.originalUrl}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </LayoutShell>
  );
}
