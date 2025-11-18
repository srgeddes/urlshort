const CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function generateSlug(length: number = 6): string {
  if (length <= 0) {
    throw new Error("Slug length must be positive");
  }

  let result = "";

  for (let i = 0; i < length; i += 1) {
    const index = Math.floor(Math.random() * CHARSET.length);
    result += CHARSET[index];
  }

  return result;
}

