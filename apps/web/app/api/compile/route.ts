import { NextRequest, NextResponse } from "next/server";
import { compilePersona } from "@goldem/sdk/src/inference";
import { personaHash as computePersonaHash } from "@goldem/sdk/src/persona";
import { generateSigil } from "@goldem/sdk/src/sigil";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { prompt } → compile a one-line vibe prompt into a full golem persona.
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "prompt required" }, { status: 400 });
    }
    const persona = await compilePersona(prompt);
    const createdAt = new Date().toISOString();
    const ph = computePersonaHash(persona, createdAt);
    const sigil = generateSigil(ph, { tier: "Bronze" });
    return NextResponse.json({ persona, personaHash: ph, createdAt, sigil });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "compile failed" }, { status: 500 });
  }
}
