export function isValidUrl(input: string): boolean {
  if (!input || typeof input !== "string") {
    return false;
  }

  try {
    const url = new URL(input);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function normalizeUrl(input: string): string {
  let value = input.trim();

  if (!value) {
    throw new Error("URL cannot be empty");
  }

  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value)) {
    value = `https://${value}`;
  }

  if (!isValidUrl(value)) {
    throw new Error("Invalid URL");
  }

  return value;
}

