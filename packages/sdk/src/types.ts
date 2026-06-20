// G0LDEM core data model. Lore: the "shem" is the encrypted brain that animates a golem.

export type GolemType =
  | "Companion"
  | "Analyst"
  | "Trader"
  | "Creator"
  | "Assistant";

/** ElizaOS-style character file — the public-ish "personality" of a golem. */
export interface Persona {
  name: string;
  type: GolemType;
  bio: string;
  lore: string[];
  adjectives: string[];
  topics: string[];
  style: string[];
  messageExamples: { user: string; golem: string }[];
}

/** The full encrypted brain: persona + skills + growing memory + activity log. */
export interface Shem {
  persona: Persona;
  skills: string[];
  memory: string[]; // grows via learn(); starts seeded
  createdAt: string;
  version: 1;
}

/** Public passport-card metadata stored at tokenURI (NEVER contains the shem). */
export interface GolemMetadata {
  name: string;
  description: string;
  image: string; // 0G Storage URI or data:image/svg+xml
  attributes: { trait_type: string; value: string | number }[];
  persona_hash: `0x${string}`;
}

/** What metadata.ts returns after sealing a shem. */
export interface SealedShem {
  encryptedURI: string; // pointer to ciphertext in 0G Storage
  metadataHash: `0x${string}`; // keccak256 of the ciphertext (anti-tamper)
  personaHash: `0x${string}`; // keccak256 of canonical public persona (Sigil seed)
  sealedKey: string; // AES key sealed for the owner (Phase 2 oracle re-seals on sale)
}
