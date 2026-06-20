import { randomBytes, createCipheriv, createDecipheriv } from "crypto";
import { keccak256 } from "ethers";
import type { Shem } from "./types";

// AES-256-GCM. The shem is ALWAYS encrypted; plaintext never leaves memory (SPEC §4.1).
const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

export interface EncryptedShem {
  blob: Buffer; // iv(12) | authTag(16) | ciphertext
  keyHex: string; // 32-byte AES key, hex. Owner holds it; Phase 2 oracle re-seals on sale.
  metadataHash: `0x${string}`; // keccak256(blob) — anti-tamper commit, goes on-chain
}

/** Encrypt a shem with a fresh random AES-256 key + random IV. */
export function encryptShem(shem: Shem, key?: Buffer): EncryptedShem {
  const aesKey = key ?? randomBytes(32);
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, aesKey, iv);
  const plaintext = Buffer.from(JSON.stringify(shem), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const blob = Buffer.concat([iv, authTag, ciphertext]);
  return {
    blob,
    keyHex: aesKey.toString("hex"),
    metadataHash: keccak256(blob) as `0x${string}`,
  };
}

/** Decrypt a shem blob with the AES key. Throws if the auth tag fails (tamper/wrong key). */
export function decryptShem(blob: Buffer, keyHex: string): Shem {
  const iv = blob.subarray(0, IV_LEN);
  const authTag = blob.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const ciphertext = blob.subarray(IV_LEN + TAG_LEN);
  const decipher = createDecipheriv(ALGO, Buffer.from(keyHex, "hex"), iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return JSON.parse(plaintext.toString("utf8")) as Shem;
}
