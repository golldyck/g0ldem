import { encryptShem } from "./crypto";
import { personaHash as computePersonaHash } from "./persona";
import { sigilDataUri, type Tier } from "./sigil";
import type { Persona, Shem, GolemMetadata, SealedShem } from "./types";

/** Assemble a fresh shem (encrypted brain) from a persona. */
export function buildShem(persona: Persona, skills: string[], seedMemory: string[] = []): Shem {
  return {
    persona,
    skills,
    memory: seedMemory,
    createdAt: new Date().toISOString(),
    version: 1,
  };
}

/** Public passport-card metadata. NEVER contains the shem. */
export function buildPublicMetadata(args: {
  persona: Persona;
  personaHash: `0x${string}`;
  image: string;
  tier?: Tier;
  level?: number;
  avs?: number;
}): GolemMetadata {
  const { persona, personaHash, image, tier = "Bronze", level = 1, avs = 0 } = args;
  return {
    name: persona.name,
    description: `${persona.type} golem — ${persona.bio}`,
    image,
    attributes: [
      { trait_type: "Type", value: persona.type },
      { trait_type: "Tier", value: tier },
      { trait_type: "Level", value: level },
      { trait_type: "AVS", value: avs },
    ],
    persona_hash: personaHash,
  };
}

/**
 * Encrypt a shem and upload the ciphertext to 0G Storage.
 * `upload` is injected (implemented in storage.ts) so this module stays storage-agnostic.
 */
export async function sealShem(
  shem: Shem,
  upload: (blob: Buffer) => Promise<string>
): Promise<SealedShem> {
  const ph = computePersonaHash(shem.persona, shem.createdAt);
  const enc = encryptShem(shem);
  const encryptedURI = await upload(enc.blob);
  return {
    encryptedURI,
    metadataHash: enc.metadataHash,
    personaHash: ph,
    sealedKey: enc.keyHex, // Phase 1: owner holds the key. Phase 2 oracle re-seals on sale.
  };
}

/** Soul Sigil image (data: URI) for a persona's hash. */
export function golemImage(personaHash: string, tier: Tier = "Bronze"): string {
  return sigilDataUri(personaHash, { tier });
}
