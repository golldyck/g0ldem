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

// Large animated hero version: the G0 monogram draws in, then the sigil pulses,
// wrapped in a slowly rotating orbital halo. Used as the landing centerpiece.
export function HeroLogo() {
  const id = "hero";
  return (
    <div className="herologo" aria-hidden>
      <svg viewBox="0 0 200 200">
        <defs>
          <linearGradient id={`hg-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={GB} /><stop offset=".55" stopColor={G} /><stop offset="1" stopColor={GD} />
          </linearGradient>
          <radialGradient id={`hc-${id}`} cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor={GB} /></radialGradient>
          <radialGradient id={`hb-${id}`} cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="rgba(201,146,15,.5)" /><stop offset="1" stopColor="rgba(201,146,15,0)" /></radialGradient>
          <filter id={`hf-${id}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* soft breathing glow */}
        <circle className="hl-glow" cx="100" cy="100" r="62" fill={`url(#hb-${id})`} />

        {/* orbital halo */}
        <g className="hl-orbit">
          <circle cx="100" cy="100" r="90" fill="none" stroke={G} strokeWidth="1" opacity=".4" strokeDasharray="2 9" />
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return <circle key={i} cx={(100 + Math.cos(a) * 90).toFixed(2)} cy={(100 + Math.sin(a) * 90).toFixed(2)} r="2.2" fill={GB} />;
          })}
        </g>
        <g className="hl-orbit2">
          <circle cx="100" cy="100" r="76" fill="none" stroke={G} strokeWidth="1" opacity=".55" strokeDasharray="14 8" />
        </g>

        {/* the G0 monogram (64-space geometry scaled into the 200 viewBox, centered) */}
        <g filter={`url(#hf-${id})`} transform="translate(33.5 33.5) scale(2.08)">
          <path className="hl-g" d="M46 19A20 20 0 1 0 50 38H33"
            fill="none" stroke={`url(#hg-${id})`} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <polygon className="hl-hex" points="32,22 41,27.5 41,38.5 32,44 23,38.5 23,27.5"
            fill="none" stroke={GB} strokeWidth="2.2" strokeLinejoin="round" />
          <circle className="hl-core" cx="32" cy="33" r="3" fill={`url(#hc-${id})`} />
        </g>
      </svg>
    </div>
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
