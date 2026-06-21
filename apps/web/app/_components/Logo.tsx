// G0LDEM logo — interlocked G0 (#17), Polished gold, dot removed, spacing zx=47.8.
// The G is a clean letterform; the 0 ring weaves through it (ownership · portability).
import * as React from "react";

// Polished gradient: white highlight → gold → deep gold
const GSTOPS: [string, string][] = [["0", "#ffffff"], [".4", "#f6c95f"], ["1", "#c9920f"]];
const ZSTOPS: [string, string][] = [["0", "#fff3cf"], ["1", "#b9830d"]];

const GX = 25, R1 = 14, R2 = 13, ZX = 47.8, SW = 6;
// weave clip — exposes the top crossing so the 0 passes OVER the G there
const D = ZX - GX;
const A = (D * D + R1 * R1 - R2 * R2) / (2 * D);
const CX = GX + A;
const CY_TOP = 32 - Math.sqrt(Math.max(0, R1 * R1 - A * A));
const CLIP_X = (CX - 6).toFixed(1);
const CLIP_Y = (CY_TOP - 8).toFixed(1);

function Mark({ glow }: { glow?: boolean }) {
  const u = React.useId().replace(/:/g, "");
  const gid = `g-${u}`, zid = `z-${u}`, fid = `f-${u}`, clip = `c-${u}`;
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" role="img" aria-label="G0LDEM">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">{GSTOPS.map(([o, c], i) => <stop key={i} offset={o} stopColor={c} />)}</linearGradient>
        <linearGradient id={zid} x1="1" y1="0" x2="-1" y2="1">{ZSTOPS.map(([o, c], i) => <stop key={i} offset={o} stopColor={c} />)}</linearGradient>
        {glow && <filter id={fid} x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="0.7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>}
        <clipPath id={clip}><rect x={CLIP_X} y={CLIP_Y} width="12" height="13" /></clipPath>
      </defs>
      <g filter={glow ? `url(#${fid})` : undefined}>
        <circle cx={ZX} cy="32" r={R2} fill="none" stroke={`url(#${zid})`} strokeWidth={SW} />
        <g transform="translate(0.1 7.1) scale(0.778)">
          <path d="M47 19 A18 18 0 1 0 50 37 H34" fill="none" stroke={`url(#${gid})`} strokeWidth={SW / 0.778} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g clipPath={`url(#${clip})`}><circle cx={ZX} cy="32" r={R2} fill="none" stroke={`url(#${zid})`} strokeWidth={SW} /></g>
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

// Large animated hero version: the 0 "snaps" into the G (forge), with a glow halo.
export function HeroLogo() {
  return (
    <div className="herologo" aria-hidden>
      <div className="hl-halo" />
      <div className="hl-mark"><Mark glow /></div>
    </div>
  );
}
