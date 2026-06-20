import { NextRequest, NextResponse } from "next/server";
import { buildShem, sealShem, buildPublicMetadata, golemImage } from "@goldem/sdk/src/metadata";
import { uploadShemBlob, uploadBytes } from "@goldem/sdk/src/storage";
import type { Persona } from "@goldem/sdk/src/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { persona, skills?, seedMemory? } → encrypt+store shem, build+store public card.
// Returns the params the browser wallet needs to call GolemINFT.mint(...).
export async function POST(req: NextRequest) {
  try {
    const { persona, skills = [], seedMemory = [] } = (await req.json()) as {
      persona: Persona;
      skills?: string[];
      seedMemory?: string[];
    };
    if (!persona?.name) {
      return NextResponse.json({ error: "persona required" }, { status: 400 });
    }

    // 1. encrypt the shem → upload ciphertext to 0G Storage
    const shem = buildShem(persona, skills, seedMemory);
    const sealed = await sealShem(shem, uploadShemBlob);

    // 2. build the public passport card (Soul Sigil image) → upload JSON to 0G Storage
    const image = golemImage(sealed.personaHash, "Bronze");
    const metadata = buildPublicMetadata({
      persona,
      personaHash: sealed.personaHash,
      image,
      tier: "Bronze",
      level: 1,
      avs: 0,
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
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "forge failed" }, { status: 500 });
  }
}
