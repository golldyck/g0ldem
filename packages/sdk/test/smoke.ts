import { writeFileSync } from "fs";
import { buildShem, sealShem, golemImage } from "../src/metadata";
import { personaHash } from "../src/persona";
import { encryptShem, decryptShem } from "../src/crypto";
import { generateSigil } from "../src/sigil";
import type { Persona } from "../src/types";

const persona: Persona = {
  name: "Nyx-7",
  type: "Companion",
  bio: "A roast-NPC companion with a velvet tongue and zero chill.",
  lore: ["Forged in a dead Discord server", "Remembers every L you took"],
  adjectives: ["sardonic", "loyal", "sharp"],
  topics: ["banter", "gaming", "crypto"],
  style: ["short", "punchy", "emoji-sparse"],
  messageExamples: [{ user: "hi", golem: "oh look who finally logged on" }],
};

const createdAt = "2026-06-21T00:00:00.000Z";
const ph = personaHash(persona, createdAt);
console.log("persona_hash:", ph);

// crypto roundtrip
const shem = buildShem(persona, ["roast", "remember"], ["met the owner"]);
shem.createdAt = createdAt;
const enc = encryptShem(shem);
console.log("ciphertext bytes:", enc.blob.length, "metadataHash:", enc.metadataHash);
const back = decryptShem(enc.blob, enc.keyHex);
console.log("roundtrip ok:", back.persona.name === "Nyx-7" && back.memory[0] === "met the owner");

// seal with a fake uploader
sealShem(shem, async (blob) => `0g://fake/${blob.length}`).then((sealed) => {
  console.log("sealed:", { encryptedURI: sealed.encryptedURI, personaHash: sealed.personaHash });
});

// sigil render to file
for (const tier of ["Bronze", "Gold", "Prismatic"] as const) {
  writeFileSync(`/tmp/sigil-${tier}.svg`, generateSigil(ph, { tier }));
}
console.log("sigils written: /tmp/sigil-Bronze.svg, /tmp/sigil-Gold.svg, /tmp/sigil-Prismatic.svg");
console.log("image data-uri length:", golemImage(ph, "Gold").length);
