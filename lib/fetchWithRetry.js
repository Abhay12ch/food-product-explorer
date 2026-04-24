/**
 * Shared resilient fetch utility for API routes.
 * Retries on 5xx errors and network failures with exponential backoff.
 */

const DEFAULT_USER_AGENT = "FoodProductExplorer/1.0 (contact@example.com)";

export async function fetchWithRetry(url, options = {}) {
  const {
    retries = 1,
    timeoutMs = 10000,
    userAgent = DEFAULT_USER_AGENT,
  } = options;

  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        headers: { "User-Agent": userAgent },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok || res.status < 500) return res;
      if (i < retries) {
        await new Promise((r) => setTimeout(r, 800 * (i + 1)));
      }
    } catch (err) {
      clearTimeout(timeout);
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, 800 * (i + 1)));
    }
  }

  throw new Error("Fetch failed after retries");
}

/* ─── Validation helpers ─── */

/** Parse and clamp a page number (must be positive integer, default 1) */
export function validatePage(raw) {
  const n = parseInt(raw || "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

/** Parse and clamp a page size (1–100, default 24) */
export function validatePageSize(raw) {
  const n = parseInt(raw || "24", 10);
  if (!Number.isFinite(n) || n < 1) return 24;
  return Math.min(n, 100);
}

/** Validate that a string looks like a barcode (8-14 digits) */
export function isValidBarcode(barcode) {
  return /^\d{8,14}$/.test(barcode);
}
