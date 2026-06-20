"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useReadContract } from "wagmi";
import { GOLEM_ADDRESS, GOLEM_ABI } from "@/lib/contract";

const GOLD = "#C9920F";

type Metadata = {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string | number }[];
  persona_hash: string;
};

export default function AgentCard() {
  const { id } = useParams<{ id: string }>();
  const tokenId = BigInt(id ?? "0");
  const enabled = GOLEM_ADDRESS !== "";

  const { data: tokenURI } = useReadContract({
    address: GOLEM_ADDRESS || undefined, abi: GOLEM_ABI, functionName: "tokenURI",
    args: [tokenId], query: { enabled },
  });
  const { data: owner } = useReadContract({
    address: GOLEM_ADDRESS || undefined, abi: GOLEM_ABI, functionName: "ownerOf",
    args: [tokenId], query: { enabled },
  });
  const { data: golem } = useReadContract({
    address: GOLEM_ADDRESS || undefined, abi: GOLEM_ABI, functionName: "golemData",
    args: [tokenId], query: { enabled },
  });

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
  const tier = meta?.attributes.find((a) => a.trait_type === "Tier")?.value ?? "Bronze";

  return (
    <main style={{ maxWidth: 520, margin: "0 auto", padding: "0 24px 48px" }}>
      <nav className="nav" style={{ padding: "22px 0", maxWidth: "100%" }}>
        <a href="/" className="brand">G<span className="z">0</span>LDEM</a>
        <div className="nav-links"><a href="/train">+ Forge another</a></div>
      </nav>

      <div style={{ border: `1px solid ${GOLD}33`, borderRadius: 18, padding: 24, marginTop: 16,
        background: "linear-gradient(160deg,#12100a,#0a0805)", boxShadow: `0 0 40px ${GOLD}14` }}>
        {!meta ? (
          <p style={{ color: "#8b8576" }}>{err ? `⚠ ${err}` : "Loading golem from 0G…"}</p>
        ) : (
          <>
            <div style={{ width: 200, height: 200, margin: "0 auto" }}
              dangerouslySetInnerHTML={{ __html: decodeSigil(meta.image) }} />
            <h1 className="display" style={{ textAlign: "center", margin: "16px 0 2px", fontSize: 30, letterSpacing: 0.5 }}>{meta.name}</h1>
            <p style={{ textAlign: "center", color: "#8b8576", margin: 0, fontSize: 13 }}>{meta.description}</p>

            <span style={{ display: "inline-block", margin: "14px auto 0", padding: "4px 12px", borderRadius: 20,
              border: `1px solid ${GOLD}`, color: GOLD, fontSize: 12, fontWeight: 700,
              position: "relative", left: "50%", transform: "translateX(-50%)" }}>
              {String(tier)} tier · #{id}
            </span>

            <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
              {meta.attributes.map((a) => (
                <div key={a.trait_type} style={{ border: "1px solid #1f1a10", borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ color: "#8b8576", fontSize: 11, textTransform: "uppercase" }}>{a.trait_type}</div>
                  <div style={{ color: "#ece7dc", fontSize: 16, fontWeight: 700 }}>{a.value}</div>
                </div>
              ))}
            </dl>

            <div style={{ marginTop: 18, fontSize: 11, color: "#6b6557", wordBreak: "break-all" }}>
              <div>owner · {owner ? String(owner) : "…"}</div>
              <div style={{ marginTop: 4 }}>shem · {encryptedURI || "…"} <span style={{ color: "#9ad29a" }}>🔒 encrypted on 0G Storage</span></div>
              <div style={{ marginTop: 4 }}>persona_hash · {meta.persona_hash.slice(0, 18)}…</div>
            </div>

            <p style={{ textAlign: "center", color: "#566", marginTop: 18, fontSize: 12 }}>
              shem on 0G Storage · inference via 0G Compute · golem on 0G Chain
            </p>
          </>
        )}
      </div>
    </main>
  );
}

// metadata.image is an SVG data: URI — decode it back to inline SVG for crisp render.
function decodeSigil(image: string): string {
  if (image.startsWith("data:image/svg+xml;base64,")) {
    try { return atob(image.split(",")[1]); } catch { /* noop */ }
  }
  return `<img src="${image}" width="200" />`;
}
