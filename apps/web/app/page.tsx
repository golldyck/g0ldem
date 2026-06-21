"use client";

import { useEffect, useRef, useState } from "react";
import { useReadContract } from "wagmi";
import { galileo } from "@/lib/chain";
import { GOLEM_ADDRESS, GOLEM_ABI } from "@/lib/contract";
import { generateSigil } from "@goldem/sdk/src/sigil";

const GOLD = "#c9920f";
const SHOWCASE_HASH = "0x89536cae1949d2636fb81b751548b34bc08c0f21c37e2fe893ae3c1d41c90095";

export default function Home() {
  useReveal();
  const scrolled = useNavScroll();
  const { data: minted } = useReadContract({
    address: GOLEM_ADDRESS || undefined, abi: GOLEM_ABI, functionName: "totalMinted",
    chainId: galileo.id, query: { enabled: GOLEM_ADDRESS !== "" },
  });
  const count = minted !== undefined ? Number(minted) : null;

  return (
    <>
      <div className="bg-fx">
        <div className="orb o1" /><div className="orb o2" /><div className="orb o3" />
        <div className="grid-fx" /><div className="grain" />
      </div>

      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-in">
          <a href="/" className="brand">G<span className="z">0</span>LDEM</a>
          <div className="nav-links">
            <a href="#how">How it works</a>
            <a href="#why">Why it wins</a>
            <a href="/agent/0">Golems</a>
            <a className="btn" href="/train">Launch app</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero wrap">
        <div className="halo"><HeroSigil /></div>
        <div className="eyebrow" style={{ marginTop: 10 }}><span className="pip" /> 0G Zero Cup · Intelligent NFTs</div>
        <h1>Forge a soul.<br /><span className="grad">Own the mind.</span></h1>
        <p className="lead">
          Vibe-code an AI golem, breathe in its <em>shem</em>, and forge it as an INFT on 0G.
          You own the intelligence itself — verifiable, portable, private. Not API access.
        </p>
        <div className="hero-cta">
          <a className="btn lg" href="/train">🔨 Forge a golem</a>
          <a className="btn ghost lg" href="#how">See how it works</a>
        </div>
        <div className="scroll-cue">↓ scroll</div>
      </header>

      {/* MARQUEE */}
      <div className="marquee">
        <div className="marquee-track">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Verifiable", "Portable", "Private", "Ownable", "On-chain", "TEE-proven"].map((w, i) => (
              <span key={`${k}-${i}`}>{w} <b>✦</b></span>
            ))
          )}
        </div>
      </div>

      {/* STATS */}
      <section className="wrap">
        <div className="stats">
          <div className="stat reveal"><div className="num"><Counter to={count ?? 0} /></div><div className="lab">Golems forged</div></div>
          <div className="stat reveal"><div className="num">256<span style={{ fontSize: 18 }}>-bit</span></div><div className="lab">AES-GCM shem</div></div>
          <div className="stat reveal"><div className="num">TEE</div><div className="lab">Verified inference</div></div>
          <div className="stat reveal"><div className="num">3</div><div className="lab">0G primitives used</div></div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="sec wrap">
        <div className="kicker reveal">The problem</div>
        <h2 className="reveal">Today you don't own AI.<br />You rent a black box.</h2>
        <p className="sub reveal">
          Hit agent tokens are speculation on top of a centralized brain. You can't prove an AI
          is answering, you can't move the intelligence, and you never truly hold it. G0LDEM flips that.
        </p>
        <div className="pillars">
          <div className="pillar reveal">
            <div className="ic">✓</div><h3>Verifiable</h3>
            <p>Every reply is signed inside a 0G Compute TEE — cryptographic proof it's the AI answering, not a human.</p>
          </div>
          <div className="pillar reveal">
            <div className="ic">⇄</div><h3>Portable</h3>
            <p>Sell a golem and its encrypted brain re-encrypts to the buyer. The mind physically moves wallets.</p>
          </div>
          <div className="pillar reveal">
            <div className="ic">🔒</div><h3>Private</h3>
            <p>The shem is AES-256-GCM encrypted on 0G Storage. Only its hash ever touches the chain.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="sec wrap" id="how">
        <div className="kicker reveal">The legend, made real</div>
        <h2 className="reveal">From clay to a mind you own</h2>
        <p className="sub reveal">The golem myth maps 1:1 onto the protocol — four steps from a sentence to an asset.</p>
        <div className="steps">
          {STEPS.map((s, i) => (
            <div className="step reveal" key={s.w}>
              <div className="n">0{i + 1}</div>
              <div className="w">{s.w}</div>
              <div className="t">{s.t}</div>
              <p>{s.p}</p>
              {i < STEPS.length - 1 && <div className="arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* SHOWCASE */}
      <section className="sec wrap">
        <div className="kicker reveal">The collectible</div>
        <h2 className="reveal">A passport that reflects its worth</h2>
        <div className="showcase">
          <div className="card-frame reveal">
            <div className="glow" />
            <div className="card-sigil" dangerouslySetInnerHTML={{ __html: generateSigil(SHOWCASE_HASH, { tier: "Gold" }) }} />
            <div className="card-name display">Nyx-7</div>
            <div className="card-sub">Companion golem · roast-NPC</div>
            <span className="tier-badge">GOLD TIER · LVL 6</span>
            <div className="card-stats">
              <div><div className="k">Type</div><div className="v">Companion</div></div>
              <div><div className="k">AVS</div><div className="v" style={{ color: GOLD }}>847</div></div>
              <div><div className="k">Verified chats</div><div className="v">1,204</div></div>
              <div><div className="k">Revenue</div><div className="v">0.9 0G</div></div>
            </div>
          </div>
          <div className="feat-list">
            <div className="feat reveal"><div className="fi">🖼️</div><div><h4>Soul Sigil</h4><p>A deterministic avatar from <code>keccak(persona)</code> — one character, one face, reproducible and verifiable by anyone.</p></div></div>
            <div className="feat reveal"><div className="fi">📈</div><div><h4>Agent Value Score</h4><p>Price built from proof: verified interactions, track record, revenue. No metric counts unless it's cryptographically sourced.</p></div></div>
            <div className="feat reveal"><div className="fi">💠</div><div><h4>Dynamic tiers</h4><p>As a golem trains and earns, its card evolves — Bronze → Silver → Gold → Prismatic. Value you can see.</p></div></div>
          </div>
        </div>
      </section>

      {/* WHY IT WINS */}
      <section className="sec wrap" id="why">
        <div className="kicker reveal">Why it wins</div>
        <h2 className="reveal">True AI ownership vs API access</h2>
        <div className="compare reveal">
          <div className="row head">
            <div>Capability</div><div className="us">G0LDEM</div><div>Agent tokens</div>
          </div>
          {COMPARE.map((r) => (
            <div className="row" key={r[0]}>
              <div className="feat-c">{r[0]}</div>
              <div className="us-c"><span className="yes">●</span> {r[1]}</div>
              <div className="them-c"><span className="no">○</span> {r[2]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TIERS */}
      <section className="sec wrap">
        <div className="kicker reveal">Collect &amp; ascend</div>
        <h2 className="reveal">Four tiers of golden minds</h2>
        <div className="tiers">
          {TIERS.map((t) => (
            <div className="tier reveal" key={t.name}>
              <div className="dot" style={{ background: t.color, color: t.color }} />
              <h4>{t.name}</h4>
              <p>{t.range}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="wrap">
        <div className="cta-band reveal">
          <h2 className="display">Breathe a soul into the clay.</h2>
          <p>Describe your golem in one sentence. Forge it on 0G in under a minute.</p>
          <div className="hero-cta"><a className="btn lg" href="/train">🔨 Forge your first golem</a></div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="foot">
        <div className="foot-in">
          <div className="chip"><span className="live" /> live on 0G Galileo{count !== null && <> · {count} forged</>}</div>
          <div className="links">
            <a href={`https://chainscan-galileo.0g.ai/address/${GOLEM_ADDRESS}`} target="_blank" rel="noreferrer">Contract ↗</a>
            <a href="https://github.com/golldyck/g0ldem" target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href="https://docs.0g.ai" target="_blank" rel="noreferrer">0G Docs ↗</a>
            <a href="/train">Launch app</a>
          </div>
        </div>
      </footer>
    </>
  );
}

const STEPS = [
  { w: "Clay", t: "base LLM · 0G Compute", p: "The raw material — a model running inside a verifiable TEE enclave." },
  { w: "Shem", t: "encrypted brain", p: "The word that animates it: persona + skills + memory, sealed and private." },
  { w: "Forge", t: "mint · 0G Chain", p: "Bring the golem to life as an ERC-7857 INFT. Its soul is committed on-chain." },
  { w: "Own", t: "ERC-7857", p: "Command it, rent it, or sell it. The intelligence is yours to move." },
];

const COMPARE: [string, string, string][] = [
  ["Own the intelligence", "Yes — the encrypted brain", "No — just a token"],
  ["Provably AI (not a human)", "TEE-signed responses", "Unverifiable"],
  ["Move the brain on sale", "Re-encrypts to buyer", "Stays centralized"],
  ["Private by default", "AES-256 on 0G Storage", "Hosted by the team"],
  ["Value from proof", "On-chain AVS inputs", "Vibes & marketing"],
];

const TIERS = [
  { name: "Bronze", range: "AVS 0–199", color: "#b07b43" },
  { name: "Silver", range: "AVS 200–499", color: "#cfd4da" },
  { name: "Gold", range: "AVS 500–899", color: "#f6c95f" },
  { name: "Prismatic", range: "AVS 900+", color: "#7ad0ff" },
];

/* ---- hooks & small components ---- */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useNavScroll() {
  const [s, setS] = useState(false);
  useEffect(() => {
    const on = () => setS(window.scrollY > 12);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return s;
}

function Counter({ to }: { to: number }) {
  const [n, setN] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) { setN(to); return; }
    started.current = true;
    const dur = 1000, t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to]);
  return <>{n}</>;
}

function HeroSigil() {
  const G = "#c9920f", GB = "#f6c95f";
  return (
    <svg viewBox="0 0 200 200" aria-hidden>
      <defs>
        <radialGradient id="hcore" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={GB} /><stop offset="1" stopColor={G} /></radialGradient>
        <filter id="hglow"><feGaussianBlur stdDeviation="2.4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <g filter="url(#hglow)">
        <circle className="spin-slow" cx="100" cy="100" r="88" fill="none" stroke={G} strokeWidth="1" opacity="0.45" strokeDasharray="2 8" />
        <g className="spin-rev">
          <circle cx="100" cy="100" r="64" fill="none" stroke={G} strokeWidth="1" opacity="0.6" strokeDasharray="10 6" />
          {Array.from({ length: 7 }).map((_, i) => {
            const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
            return <circle key={i} cx={100 + Math.cos(a) * 64} cy={100 + Math.sin(a) * 64} r="3.4" fill={GB} />;
          })}
        </g>
        <polygon points="100,60 134,80 134,120 100,140 66,120 66,80" fill="none" stroke={GB} strokeWidth="1.6" opacity="0.9" />
        <circle className="core" cx="100" cy="100" r="9" fill="url(#hcore)" />
      </g>
    </svg>
  );
}
