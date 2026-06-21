// Server-side guards for the public API routes: rate limiting, input-size caps,
// and safe error responses. In-memory limiter (single Railway instance is fine).
import { NextRequest, NextResponse } from "next/server";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/** Sliding fixed-window limiter. Returns null if allowed, or a 429 response. */
export function rateLimit(req: NextRequest, key: string, max: number, windowMs: number): NextResponse | null {
  const id = `${key}:${clientIp(req)}`;
  const now = Date.now();
  const b = buckets.get(id);
  if (!b || now > b.resetAt) {
    buckets.set(id, { count: 1, resetAt: now + windowMs });
    return null;
  }
  if (b.count >= max) {
    const retry = Math.ceil((b.resetAt - now) / 1000);
    return NextResponse.json({ error: "rate limit exceeded" }, { status: 429, headers: { "retry-after": String(retry) } });
  }
  b.count++;
  return null;
}

// occasional cleanup so the map can't grow unbounded
function sweep() {
  const now = Date.now();
  for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
}

/** Read a JSON body with a hard byte cap. Throws on oversize/invalid. */
export async function readJson(req: NextRequest, maxBytes: number): Promise<any> {
  const text = await req.text();
  if (text.length > maxBytes) throw new GuardError(`body too large (max ${maxBytes} bytes)`, 413);
  try {
    return JSON.parse(text);
  } catch {
    throw new GuardError("invalid JSON", 400);
  }
}

export class GuardError extends Error {
  status: number;
  constructor(msg: string, status = 400) {
    super(msg);
    this.status = status;
  }
}

/** Generic, leak-free error response. Logs the real error server-side only. */
export function fail(e: unknown, fallback = "request failed"): NextResponse {
  if (e instanceof GuardError) return NextResponse.json({ error: e.message }, { status: e.status });
  console.error("[api error]", e); // server log only
  if (Math.random() < 0.02) sweep();
  return NextResponse.json({ error: fallback }, { status: 500 });
}

/** Validate a 0G storage root hash (0x + 64 hex). */
export function isRootHash(s: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(s);
}

/** Cap a string field; throw GuardError if missing or too long. */
export function reqStr(v: unknown, name: string, maxLen: number): string {
  if (typeof v !== "string" || v.length === 0) throw new GuardError(`${name} required`);
  if (v.length > maxLen) throw new GuardError(`${name} too long (max ${maxLen})`);
  return v;
}
