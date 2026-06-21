import { NextRequest, NextResponse } from "next/server";
import { verifiedChat, shemSystemPrompt, type ChatMsg } from "@goldem/sdk/src/inference";
import { buildShem } from "@goldem/sdk/src/metadata";
import type { Persona } from "@goldem/sdk/src/types";
import { rateLimit, readJson, fail, GuardError } from "@/lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { persona, messages:[{role,content}] } → verifiable reply from the golem.
export async function POST(req: NextRequest) {
  const limited = rateLimit(req, "chat", 20, 60_000); // 20/min/IP
  if (limited) return limited;
  try {
    const body = await readJson(req, 16_000);
    const persona = body?.persona as Persona;
    const messages = body?.messages as ChatMsg[];
    if (!persona?.name) throw new GuardError("persona required");
    if (!Array.isArray(messages) || messages.length === 0) throw new GuardError("messages required");
    if (messages.length > 32) throw new GuardError("too many messages (max 32)");
    for (const m of messages) {
      if (typeof m?.content !== "string" || m.content.length > 4_000) throw new GuardError("message too long");
    }
    const shem = buildShem(persona, [], []);
    const system: ChatMsg = { role: "system", content: shemSystemPrompt(shem) };
    const res = await verifiedChat([system, ...messages]);
    return NextResponse.json(res);
  } catch (e) {
    return fail(e, "chat failed");
  }
}
