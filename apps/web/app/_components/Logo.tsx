// G0LDEM logo — interlocked "GO" chain-link. G leads (left), 0 ring weaves through it (right).
// Ownership · portability. Metallic gold, clean over/under weave (no cut-out dot).
import * as React from "react";

// Metallic gold gradient (white highlight → gold → deep gold → gold → cream)
const METAL: [string, string][] = [
  ["0", "#FFF7D6"], [".28", "#F6C84C"], [".55", "#A9690C"], [".78", "#F3C24A"], ["1", "#FFF1C0"],
];

function Mark({ glow }: { glow?: boolean }) {
  const u = React.useId().replace(/:/g, "");
  const gid = `m-${u}`, fid = `f-${u}`, clip = `c-${u}`;
  return (
    <svg viewBox="25 8 250 190" width="100%" height="100%" role="img" aria-label="G0LDEM">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          {METAL.map(([o, c], i) => <stop key={i} offset={o} stopColor={c} />)}
        </linearGradient>
        {glow && <filter id={fid} x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>}
        {/* weave window — the 0 passes OVER the G at the bottom crossing */}
        <clipPath id={clip}><circle cx="150" cy="149" r="27" /></clipPath>
      </defs>
      <g filter={glow ? `url(#${fid})` : undefined} fill="none" stroke={`url(#${gid})`} strokeWidth={23} strokeLinecap="round" strokeLinejoin="round">
        {/* 0 ring (back, right) */}
        <circle cx="185" cy="103" r="58" />
        {/* G (front, left): body + tongue */}
        <path d="M164 72 A58 58 0 1 0 164 134" />
        <path d="M164 134 L164 111 L129 111" />
        {/* slice of the 0 redrawn over the G at the bottom crossing → weave, no cut-out */}
        <g clipPath={`url(#${clip})`}><circle cx="185" cy="103" r="58" /></g>
      </g>
    </svg>
  );
}

export function LogoMark({ size = 32, glow = false }: { size?: number; glow?: boolean }) {
  return <span style={{ display: "inline-block", width: size, height: size }}><Mark glow={glow} /></span>;
}

export function Logo({ size = 30, href = "/" }: { size?: number; href?: string }) {
  return (
    <a href={href} className="logo-lockup" aria-label="G0LDEM home">
      <LogoMark size={size} />
      <span className="logo-word">G<span className="z">0</span>LDEM</span>
    </a>
  );
}

// Large animated hero version with a soft glow halo.
export function HeroLogo() {
  return (
    <div className="herologo" aria-hidden>
      <div className="hl-halo" />
      <div className="hl-mark"><Mark glow /></div>
    </div>
  );
}
