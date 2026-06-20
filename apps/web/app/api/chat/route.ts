import { NextRequest, NextResponse } from "next/server";
import { verifiedChat, shemSystemPrompt, type ChatMsg } from "@goldem/sdk/src/inference";
import { buildShem } from "@goldem/sdk/src/metadata";
import type { Persona } from "@goldem/sdk/src/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { persona, messages:[{role,content}] } → verifiable reply from the golem.
export async function POST(req: NextRequest) {
  try {
    const { persona, messages } = (await req.json()) as {
      persona: Persona;
      messages: ChatMsg[];
    };
    if (!persona || !Array.isArray(messages)) {
      return NextResponse.json({ error: "persona + messages required" }, { status: 400 });
    }
    const shem = buildShem(persona, [], []);
    const system: ChatMsg = { role: "system", content: shemSystemPrompt(shem) };
    const res = await verifiedChat([system, ...messages]);
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "chat failed" }, { status: 500 });
  }
}
