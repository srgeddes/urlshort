"use client";

import { useState } from "react";

type ShortUrlResultProps = {
  shortUrl: string;
  originalUrl: string;
};

export function ShortUrlResult({
  shortUrl,
  originalUrl,
}: ShortUrlResultProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setCopyError(null);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopyError("Could not copy. Please copy manually.");
      setCopied(false);
    }
  }

  return (
    <section
      aria-label="Short URL result"
      className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
    >
      <p className="text-sm font-medium text-slate-700">
        Your short link is ready
      </p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="truncate text-sm text-slate-900">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sky-700 hover:underline"
          >
            {shortUrl}
          </a>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center rounded-full bg-sky-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 active:bg-sky-800 disabled:cursor-not-allowed disabled:bg-sky-300"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="mt-2 line-clamp-2 text-xs text-slate-600">
        {originalUrl}
      </p>
      {copyError && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {copyError}
        </p>
      )}
      {copied && !copyError && (
        <p className="mt-1 text-xs text-emerald-600" role="status">
          Copied to clipboard
        </p>
      )}
    </section>
  );
}

