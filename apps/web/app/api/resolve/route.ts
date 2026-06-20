import { NextRequest, NextResponse } from "next/server";
import { downloadBytes } from "@goldem/sdk/src/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET ?uri=0g://<rootHash>  → download the public metadata JSON from 0G Storage.
export async function GET(req: NextRequest) {
  try {
    const uri = req.nextUrl.searchParams.get("uri") || "";
    const root = uri.replace(/^0g:\/\//, "");
    if (!root) return NextResponse.json({ error: "uri required" }, { status: 400 });
    const bytes = await downloadBytes(root);
    const json = JSON.parse(bytes.toString("utf8"));
    return NextResponse.json(json);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "resolve failed" }, { status: 500 });
  }
}
