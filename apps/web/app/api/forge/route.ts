import { NextRequest, NextResponse } from "next/server";
import { buildShem, sealShem, buildPublicMetadata, golemImage } from "@goldem/sdk/src/metadata";
import { uploadShemBlob, uploadBytes } from "@goldem/sdk/src/storage";
import type { Persona } from "@goldem/sdk/src/types";
import { rateLimit, readJson, fail, GuardError } from "@/lib/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { persona, skills?, seedMemory? } → encrypt+store shem, build+store public card.
// Returns the params the browser wallet needs to call GolemINFT.mint(...).
// forge spends gas from the server wallet → strictly rate-limited + size-capped.
export async function POST(req: NextRequest) {
  const limited = rateLimit(req, "forge", 5, 60_000); // 5/min/IP — this one costs gas
  if (limited) return limited;
  try {
    const body = await readJson(req, 16_000);
    const persona = body?.persona as Persona;
    const skills = Array.isArray(body?.skills) ? body.skills.slice(0, 16).map(String) : [];
    const seedMemory = Array.isArray(body?.seedMemory) ? body.seedMemory.slice(0, 32).map(String) : [];
    if (!persona?.name || typeof persona.name !== "string") throw new GuardError("persona required");
    if (JSON.stringify(persona).length > 12_000) throw new GuardError("persona too large");

    // 1. encrypt the shem → upload ciphertext to 0G Storage
    const shem = buildShem(persona, skills, seedMemory);
    const sealed = await sealShem(shem, uploadShemBlob);

    // 2. build the public passport card (Soul Sigil image) → upload JSON to 0G Storage
    const image = golemImage(sealed.personaHash, "Bronze");
    const metadata = buildPublicMetadata({
      persona, personaHash: sealed.personaHash, image, tier: "Bronze", level: 1, avs: 0,
    });
    const metaRoot = await uploadBytes(new TextEncoder().encode(JSON.stringify(metadata)));
    const tokenURI = `0g://${metaRoot}`;

    return NextResponse.json({
      tokenURI,
      encryptedURI: `0g://${sealed.encryptedURI}`,
      metadataHash: sealed.metadataHash,
      personaHash: sealed.personaHash,
      image,
      metadata,
    });
  } catch (e) {
    return fail(e, "forge failed");
  }
}
