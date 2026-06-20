"use client";

import { useReadContract } from "wagmi";
import { galileo } from "@/lib/chain";
import { GOLEM_ADDRESS, GOLEM_ABI } from "@/lib/contract";

export default function Home() {
  const { data: minted } = useReadContract({
    address: GOLEM_ADDRESS || undefined,
    abi: GOLEM_ABI,
    functionName: "totalMinted",
    chainId: galileo.id,
    query: { enabled: GOLEM_ADDRESS !== "" },
  });

  return (
    <>
      <nav className="nav">
        <a href="/" className="brand">G<span className="z">0</span>LDEM</a>
        <div className="nav-links">
          <a href="/train">Forge</a>
          <a href="/agent/0">Golems</a>
          <a href="https://docs.0g.ai" target="_blank" rel="noreferrer">0G</a>
          <a className="btn" href="/train">Launch app</a>
        </div>
      </nav>

      <header className="hero wrap narrow">
        <div className="halo rise">
          <Sigil />
        </div>
        <div className="eyebrow rise d1" style={{ marginTop: 8 }}>★ 0G Zero Cup · Intelligent NFTs</div>
        <h1 className="rise d1">
          Forge a soul.<br />
          <span className="grad">Own the mind.</span>
        </h1>
        <p className="lead rise d2">
          Vibe-code an AI golem, breathe in its <em>shem</em>, and forge it as an INFT on 0G.
          You own the intelligence itself — verifiable, portable, private. Not API access.
        </p>
        <div className="hero-cta rise d3">
          <a className="btn" href="/train">🔨 Forge a golem</a>
          <a className="btn ghost" href="/agent/0">View a golem →</a>
        </div>
      </header>

      <section className="wrap">
        <div className="pillars">
          <div className="pillar rise d1">
            <div className="ic">✓</div>
            <h3>Verifiable</h3>
            <p>Every reply is signed inside a 0G Compute TEE — provable it's the AI answering, not a human.</p>
          </div>
          <div className="pillar rise d2">
            <div className="ic">⇄</div>
            <h3>Portable</h3>
            <p>Sell a golem and its encrypted brain re-encrypts to the buyer. The mind physically moves.</p>
          </div>
          <div className="pillar rise d3">
            <div className="ic">🔒</div>
            <h3>Private</h3>
            <p>The shem is AES-256-GCM encrypted on 0G Storage. Only its hash ever touches the chain.</p>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ marginTop: 84 }}>
        <div className="section-eyebrow">The legend, made real</div>
        <h2 className="section-title display">From clay to a mind you own</h2>
        <div className="lore">
          {LORE.map((s, i) => (
            <div key={s.word} className={`lore-step rise d${i + 1}`}>
              <div className="n">0{i + 1}</div>
              <div className="lore-word">{s.word}</div>
              <div className="tech">{s.tech}</div>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="foot wrap">
        <div className="chip">
          <span className="dot" /> live on 0G Galileo
          {minted !== undefined && <> · {minted.toString()} golems forged</>}
        </div>
        <div>
          <a href={`https://chainscan-galileo.0g.ai/address/${GOLEM_ADDRESS}`} target="_blank" rel="noreferrer">
            GolemINFT contract ↗
          </a>{" "}
          · shem on 0G Storage · inference via 0G Compute · ERC-7857
        </div>
      </footer>
    </>
  );
}

const LORE = [
  { word: "Clay", tech: "base LLM · 0G Compute", body: "The raw material — a model running inside a verifiable TEE enclave." },
  { word: "Shem", tech: "encrypted brain", body: "The word that animates it: persona + skills + memory, sealed and private." },
  { word: "Forge", tech: "mint · 0G Chain", body: "Bring the golem to life as an ERC-7857 INFT. The soul is committed on-chain." },
  { word: "Own", tech: "ERC-7857 ownership", body: "Command it, rent it, or sell it. The intelligence is yours to move." },
];

function Sigil() {
  const G = "#c9920f", GB = "#f4c45a";
  return (
    <svg viewBox="0 0 200 200" aria-hidden>
      <defs>
        <radialGradient id="hcore" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={GB} />
          <stop offset="1" stopColor={G} />
        </radialGradient>
        <filter id="hglow"><feGaussianBlur stdDeviation="2.4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <g filter="url(#hglow)">
        <circle className="spin-slow" cx="100" cy="100" r="86" fill="none" stroke={G} strokeWidth="1" opacity="0.5" strokeDasharray="2 7" />
        <g className="spin-rev">
          <circle cx="100" cy="100" r="64" fill="none" stroke={G} strokeWidth="1" opacity="0.6" strokeDasharray="10 6" />
          {Array.from({ length: 7 }).map((_, i) => {
            const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
            return <circle key={i} cx={100 + Math.cos(a) * 64} cy={100 + Math.sin(a) * 64} r="3.4" fill={GB} />;
          })}
        </g>
        <polygon points="100,62 133,81 133,119 100,138 67,119 67,81" fill="none" stroke={GB} strokeWidth="1.6" opacity="0.9" />
        <circle className="core" cx="100" cy="100" r="9" fill="url(#hcore)" />
      </g>
    </svg>
  );
}
