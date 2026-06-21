import { NextRequest, NextResponse } from "next/server";
import { compilePersona } from "@goldem/sdk/src/inference";
import { personaHash as computePersonaHash } from "@goldem/sdk/src/persona";
import { generateSigil } from "@goldem/sdk/src/sigil";
import { rateLimit, readJson, reqStr, fail } from "@/lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { prompt } → compile a one-line vibe prompt into a full golem persona.
export async function POST(req: NextRequest) {
  const limited = rateLimit(req, "compile", 10, 60_000); // 10/min/IP
  if (limited) return limited;
  try {
    const body = await readJson(req, 4_000);
    const prompt = reqStr(body?.prompt, "prompt", 2_000);
    const persona = await compilePersona(prompt);
    const createdAt = new Date().toISOString();
    const ph = computePersonaHash(persona, createdAt);
    const sigil = generateSigil(ph, { tier: "Bronze" });
    return NextResponse.json({ persona, personaHash: ph, createdAt, sigil });
  } catch (e) {
    return fail(e, "compile failed");
  }
}
