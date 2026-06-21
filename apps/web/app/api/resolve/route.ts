import { NextRequest, NextResponse } from "next/server";
import { downloadBytes } from "@goldem/sdk/src/storage";
import { rateLimit, isRootHash, fail, GuardError } from "@/lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET ?uri=0g://<rootHash>  → download the public metadata JSON from 0G Storage.
export async function GET(req: NextRequest) {
  const limited = rateLimit(req, "resolve", 60, 60_000); // 60/min/IP (read-only)
  if (limited) return limited;
  try {
    const uri = req.nextUrl.searchParams.get("uri") || "";
    const root = uri.replace(/^0g:\/\//, "");
    if (!isRootHash(root)) throw new GuardError("invalid uri");
    const bytes = await downloadBytes(root);
    if (bytes.length > 256_000) throw new GuardError("object too large", 413);
    const json = JSON.parse(bytes.toString("utf8"));
    return NextResponse.json(json);
  } catch (e) {
    return fail(e, "resolve failed");
  }
}
