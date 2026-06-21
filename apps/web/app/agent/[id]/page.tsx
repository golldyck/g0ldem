"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useReadContract } from "wagmi";
import { galileo } from "@/lib/chain";
import { GOLEM_ADDRESS, GOLEM_ABI } from "@/lib/contract";
import { Lock, Sigil, Verified, Transfer, Anvil } from "../../_components/Icons";

type Metadata = {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string | number }[];
  persona_hash: string;
};

const TIER_STYLE: Record<string, { line: string; glow: string; text: string }> = {
  Bronze: { line: "rgba(176,123,67,.55)", glow: "rgba(176,123,67,.4)", text: "#d39a5e" },
  Silver: { line: "rgba(199,203,209,.5)", glow: "rgba(199,203,209,.32)", text: "#dfe3e9" },
  Gold: { line: "rgba(201,146,15,.6)", glow: "rgba(201,146,15,.5)", text: "#f6c95f" },
  Prismatic: { line: "rgba(122,208,255,.55)", glow: "rgba(122,208,255,.4)", text: "#9fdcff" },
};

export default function AgentCard() {
  const { id } = useParams<{ id: string }>();
  const tokenId = BigInt(id ?? "0");
  const enabled = GOLEM_ADDRESS !== "";
  const [copied, setCopied] = useState(false);

  const { data: tokenURI } = useReadContract({ address: GOLEM_ADDRESS || undefined, abi: GOLEM_ABI, functionName: "tokenURI", args: [tokenId], chainId: galileo.id, query: { enabled } });
  const { data: owner } = useReadContract({ address: GOLEM_ADDRESS || undefined, abi: GOLEM_ABI, functionName: "ownerOf", args: [tokenId], chainId: galileo.id, query: { enabled } });
  const { data: golem } = useReadContract({ address: GOLEM_ADDRESS || undefined, abi: GOLEM_ABI, functionName: "golemData", args: [tokenId], chainId: galileo.id, query: { enabled } });

  const [meta, setMeta] = useState<Metadata | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!tokenURI) return;
    fetch(`/api/resolve?uri=${encodeURIComponent(tokenURI as string)}`)
      .then((r) => r.json())
      .then((d) => (d.error ? setErr(d.error) : setMeta(d)))
      .catch((e) => setErr(String(e)));
  }, [tokenURI]);

  const encryptedURI = golem ? (golem as any)[0] : "";
  const tier = String(meta?.attributes.find((a) => a.trait_type === "Tier")?.value ?? "Bronze");
  const ts = TIER_STYLE[tier] ?? TIER_STYLE.Bronze;

  function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); });
  }

  return (
    <>
      <div className="bg-fx"><div className="orb o1" /><div className="orb o2" /><div className="grid-fx" /><div className="grain" /></div>

      <nav className="nav">
        <div className="nav-in">
          <a href="/" className="brand">G<span className="z">0</span>LDEM</a>
          <div className="nav-links"><a href="/">Home</a><a href="/train">Forge</a></div>
        </div>
      </nav>

      <main className="gcard-wrap">
        <div className="gcard" style={{ ["--tier" as any]: ts.line, ["--tierglow" as any]: ts.glow, ["--tiertext" as any]: ts.text }}>
          {!meta ? (
            <div className="gloading">{err ? `⚠ ${err}` : "Summoning golem from 0G…"}</div>
          ) : (
            <>
              <div className="sig" dangerouslySetInnerHTML={{ __html: decodeSigil(meta.image) }} />
              <div className="gname display">{meta.name}</div>
              <p className="gdesc">{meta.description}</p>
              <div className="gtier"><span><Sigil size={14} /> {tier} tier · #{id}</span></div>

              <div className="gstats">
                {meta.attributes.map((a) => (
                  <div key={a.trait_type}>
                    <div className="k">{a.trait_type}</div>
                    <div className={`v ${a.trait_type === "AVS" ? "gold" : ""}`}>{a.value}</div>
                  </div>
                ))}
              </div>

              <div className="prov">
                <div className="pr"><Verified size={14} /> owner · {owner ? short(String(owner)) : "…"}</div>
                <div className="pr"><Lock size={14} /> shem · encrypted on 0G Storage {encryptedURI && <span style={{ color: "#6b6557" }}>({short(encryptedURI.replace("0g://", ""))})</span>}</div>
                <div className="pr"><Sigil size={14} /> persona_hash · {meta.persona_hash.slice(0, 22)}…</div>
              </div>

              <div className="gactions">
                <button className="btn ghost" onClick={share}><Transfer size={16} /> {copied ? "Link copied!" : "Share"}</button>
                <a className="btn" href={`https://chainscan-galileo.0g.ai/token/${GOLEM_ADDRESS}?a=${id}`} target="_blank" rel="noreferrer"><Verified size={16} /> Verify on-chain</a>
              </div>

              <div className="gfoot">shem on 0G Storage · inference via 0G Compute · golem on 0G Chain</div>
            </>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 22 }}>
          <a className="btn ghost" href="/train"><Anvil size={16} /> Forge another golem</a>
        </div>
      </main>
    </>
  );
}

function short(s: string) {
  return s.length > 16 ? `${s.slice(0, 8)}…${s.slice(-6)}` : s;
}

// metadata.image is an SVG data: URI — decode it back to inline SVG for crisp render.
function decodeSigil(image: string): string {
  if (image.startsWith("data:image/svg+xml;base64,")) {
    try { return atob(image.split(",")[1]); } catch { /* noop */ }
  }
  return `<img src="${image}" width="210" alt="Soul Sigil" />`;
}
