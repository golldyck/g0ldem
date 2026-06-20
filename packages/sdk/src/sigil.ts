// Soul Sigil — deterministic SVG avatar derived from persona_hash.
// Same persona → same sigil (a fingerprint). No inference, no randomness from
// Date/Math.random — everything is seeded from the hash, so anyone can reproduce
// and verify it (anti image-swap, SPEC §5.2).

export type Tier = "Bronze" | "Silver" | "Gold" | "Prismatic";

const TIER_PALETTE: Record<Tier, { ring: string; node: string; glow: string }> = {
  Bronze: { ring: "#B07B43", node: "#E2A95B", glow: "#7a4f23" },
  Silver: { ring: "#C7CBD1", node: "#EEF1F5", glow: "#7f868f" },
  Gold: { ring: "#C9920F", node: "#F4C45A", glow: "#8a6209" },
  Prismatic: { ring: "url(#prism)", node: "#FFFFFF", glow: "#C9920F" },
};

/** Seeded PRNG (mulberry32) so the sigil is fully deterministic from the hash. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromHash(personaHash: string): number {
  const hex = personaHash.replace(/^0x/, "");
  let h = 0;
  for (let i = 0; i < hex.length; i += 8) {
    h ^= parseInt(hex.slice(i, i + 8), 16) >>> 0;
  }
  return h >>> 0;
}

export interface SigilOptions {
  tier?: Tier;
  size?: number;
}

/** Generate the Soul Sigil as an SVG string. */
export function generateSigil(personaHash: string, opts: SigilOptions = {}): string {
  const tier = opts.tier ?? "Bronze";
  const size = opts.size ?? 320;
  const rng = mulberry32(seedFromHash(personaHash));
  const pal = TIER_PALETTE[tier];

  const cx = size / 2;
  const cy = size / 2;
  const symmetry = 5 + Math.floor(rng() * 5); // 5..9 nodes
  const rings = 2 + Math.floor(rng() * 3); // 2..4 rings
  const maxR = size * 0.4;

  const parts: string[] = [];

  // concentric rings
  for (let r = 0; r < rings; r++) {
    const radius = maxR * ((r + 1) / rings);
    const dash = rng() > 0.5 ? `stroke-dasharray="${2 + Math.floor(rng() * 6)} ${3 + Math.floor(rng() * 5)}"` : "";
    parts.push(
      `<circle cx="${cx}" cy="${cy}" r="${radius.toFixed(1)}" fill="none" stroke="${pal.ring}" stroke-width="1.2" opacity="${(0.35 + r * 0.2).toFixed(2)}" ${dash}/>`
    );
  }

  // symmetric nodes + spokes on the outer ring
  const nodeR = maxR;
  const nodeSize = 3 + rng() * 3;
  for (let i = 0; i < symmetry; i++) {
    const ang = (i / symmetry) * Math.PI * 2 - Math.PI / 2;
    const nx = cx + Math.cos(ang) * nodeR;
    const ny = cy + Math.sin(ang) * nodeR;
    parts.push(
      `<line x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="${pal.ring}" stroke-width="0.8" opacity="0.4"/>`
    );
    parts.push(
      `<circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="${nodeSize.toFixed(1)}" fill="${pal.node}"/>`
    );
  }

  // central glyph — a rotated symmetry-gon
  const glyphR = maxR * 0.28;
  const rot = rng() * Math.PI;
  const pts: string[] = [];
  for (let i = 0; i < symmetry; i++) {
    const ang = (i / symmetry) * Math.PI * 2 + rot;
    pts.push(`${(cx + Math.cos(ang) * glyphR).toFixed(1)},${(cy + Math.sin(ang) * glyphR).toFixed(1)}`);
  }
  parts.push(
    `<polygon points="${pts.join(" ")}" fill="none" stroke="${pal.node}" stroke-width="1.6" opacity="0.9"/>`
  );
  parts.push(`<circle cx="${cx}" cy="${cy}" r="${(nodeSize * 1.2).toFixed(1)}" fill="${pal.node}"/>`);

  const prismDef =
    tier === "Prismatic"
      ? `<linearGradient id="prism" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C9920F"/><stop offset="0.5" stop-color="#7ad0ff"/><stop offset="1" stop-color="#ff7ad0"/></linearGradient>`
      : "";

  // No width/height attrs → the SVG scales to its container (viewBox keeps coords).
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%" style="display:block">
  <defs>${prismDef}<radialGradient id="bg" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stop-color="#15110a"/><stop offset="1" stop-color="#0a0805"/></radialGradient>
  <filter id="glow"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <rect width="${size}" height="${size}" rx="${size * 0.06}" fill="url(#bg)"/>
  <g filter="url(#glow)">${parts.join("")}</g>
</svg>`;
}

/** Sigil as a data: URI — can go straight on-chain or into tokenURI image. */
export function sigilDataUri(personaHash: string, opts: SigilOptions = {}): string {
  const svg = generateSigil(personaHash, opts);
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
