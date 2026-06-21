// G0LDEM icon set — line-art, stroke=currentColor, matches the Soul Sigil aesthetic.
import * as React from "react";

type P = { size?: number; className?: string };
const base = (size: number): React.SVGProps<SVGSVGElement> => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round",
});

// Forge / anvil — minting
export const Anvil = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 9h11a4 4 0 0 1-4 4H9" /><path d="M15 9l4-1v2l-2 1" />
    <path d="M9 13v3" /><path d="M6 19h8" /><path d="M8 16h4l1 3H7l1-3Z" />
  </svg>
);

// Shield-check — verifiable
export const Verified = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" /><path d="M9 11.5l2 2 4-4" />
  </svg>
);

// Swap arrows — portable
export const Transfer = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M5 8h12" /><path d="M14 5l3 3-3 3" /><path d="M19 16H7" /><path d="M10 13l-3 3 3 3" />
  </svg>
);

// Padlock — private
export const Lock = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><circle cx="12" cy="15" r="1.4" />
  </svg>
);

// Sigil — deterministic avatar
export const Sigil = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="8.5" opacity="0.5" /><polygon points="12,6 17,9 17,15 12,18 7,15 7,9" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
  </svg>
);

// Chart trending up — value / AVS
export const Chart = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 19V5" /><path d="M4 19h16" /><path d="M7 15l3-4 3 2 4-6" /><path d="M17 7h2v2" />
  </svg>
);

// Faceted gem — tiers / rarity
export const Gem = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6 4h12l3 5-9 11L3 9l3-5Z" /><path d="M3 9h18" /><path d="M9 4l-2 5 5 11 5-11-2-5" />
  </svg>
);

// Chevrons down — scroll cue
export const ChevronDown = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}><path d="M6 9l6 6 6-6" /></svg>
);

// Arrow right — steps / CTAs
export const ArrowRight = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
);

// Four-point spark — marquee / accents
export const Spark = ({ size = 14, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2c.6 4.8 2.4 6.6 8 7-5.6.4-7.4 2.2-8 7-.6-4.8-2.4-6.6-8-7 5.6-.4 7.4-2.2 8-7Z" />
  </svg>
);
