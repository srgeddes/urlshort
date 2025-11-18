"use client";

import { useState } from "react";

type ShortenResult = {
  slug: string;
  originalUrl: string;
  shortUrl: string;
};

type UrlShortenerFormProps = {
  onShorten: (result: ShortenResult) => void;
};

export function UrlShortenerForm({ onShorten }: UrlShortenerFormProps) {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmed = inputUrl.trim();

    if (!trimmed) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          typeof data?.error === "string"
            ? data.error
            : "Something went wrong, please try again",
        );
        return;
      }

      onShorten(data as ShortenResult);
    } catch (err) {
      console.error("Error submitting URL", err);
      setError("Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <div>
        <label
          htmlFor="url"
          className="block text-sm font-medium text-slate-700"
        >
          Paste a long URL
        </label>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row">
          <input
            id="url"
            name="url"
            type="url"
            placeholder="https://example.com/some/very/long/link"
            className="flex-1 rounded-full border border-slate-300 px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            value={inputUrl}
            onChange={(event) => setInputUrl(event.target.value)}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "url-error" : undefined}
            disabled={loading}
          />
          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 active:bg-sky-800 disabled:cursor-not-allowed disabled:bg-sky-300 sm:mt-0"
            disabled={loading}
          >
            {loading ? "Shortening..." : "Shorten"}
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          We only support http and https links.
        </p>
      </div>
      {error && (
        <p id="url-error" className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

