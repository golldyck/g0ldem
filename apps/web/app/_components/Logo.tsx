// G0LDEM logo — "G0 monogram": a bold G whose counter holds the golden zero-sigil.
import * as React from "react";

const GB = "#f6c95f", G = "#c9920f", GD = "#8a6209";

export function LogoMark({ size = 32, glow = true }: { size?: number; glow?: boolean }) {
  const id = React.useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="G0LDEM">
      <defs>
        <linearGradient id={`lg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={GB} /><stop offset=".55" stopColor={G} /><stop offset="1" stopColor={GD} />
        </linearGradient>
        <radialGradient id={`lc-${id}`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff" /><stop offset="1" stopColor={GB} />
        </radialGradient>
        {glow && (
          <filter id={`lf-${id}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        )}
      </defs>
      <g filter={glow ? `url(#lf-${id})` : undefined}>
        {/* the G — open ring with a spur into the centre */}
        <path d="M46 19A20 20 0 1 0 50 38H33"
          fill="none" stroke={`url(#lg-${id})`} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        {/* the 0 — zero-sigil hexagon */}
        <polygon points="32,22 41,27.5 41,38.5 32,44 23,38.5 23,27.5"
          fill="none" stroke={GB} strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx="32" cy="33" r="3" fill={`url(#lc-${id})`} />
      </g>
    </svg>
  );
}

export function Logo({ size = 30, href = "/" }: { size?: number; href?: string }) {
  return (
    <a href={href} className="logo-lockup" aria-label="G0LDEM home">
      <LogoMark size={size} />
      <span className="logo-word">G<span className="z">0</span>LDEM</span>
    </a>
  );
}
