import { keccak256, toUtf8Bytes } from "ethers";
import type { Persona } from "./types";

/**
 * Canonical JSON of the PUBLIC persona fields only (name + type + bio + createdAt).
 * Stable key order so the hash is reproducible by anyone (anti image-swap, SPEC §5.2).
 */
export function canonicalPersonaJson(persona: Persona, createdAt: string): string {
  return JSON.stringify({
    name: persona.name,
    type: persona.type,
    bio: persona.bio,
    createdAt,
  });
}

/** persona_hash = keccak256(canonical public persona). Seeds the Soul Sigil. */
export function personaHash(persona: Persona, createdAt: string): `0x${string}` {
  return keccak256(toUtf8Bytes(canonicalPersonaJson(persona, createdAt))) as `0x${string}`;
}
