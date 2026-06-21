"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useConnect, useWriteContract, usePublicClient, useSwitchChain } from "wagmi";
import { parseEventLogs } from "viem";
import { galileo } from "@/lib/chain";
import { GOLEM_ADDRESS, GOLEM_ABI } from "@/lib/contract";
import type { Persona } from "@goldem/sdk/src/types";
import { Anvil } from "../_components/Icons";

const GOLD = "#C9920F";

type Msg = { role: "user" | "assistant"; content: string; verified?: boolean; mock?: boolean };

export default function Train() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient({ chainId: galileo.id });
  const { switchChainAsync } = useSwitchChain();

  const [prompt, setPrompt] = useState("a sardonic roast-NPC companion who remembers every L you take");
  const [persona, setPersona] = useState<Persona | null>(null);
  const [sigil, setSigil] = useState<string>("");
  const [busy, setBusy] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [chatInput, setChatInput] = useState("");

  async function compile() {
    setError(""); setBusy("compiling"); setPersona(null); setMessages([]);
    try {
      const r = await fetch("/api/compile", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      setPersona(data.persona); setSigil(data.sigil);
    } catch (e: any) { setError(e.message); } finally { setBusy(""); }
  }

  async function send() {
    if (!chatInput.trim() || !persona) return;
    const next: Msg[] = [...messages, { role: "user", content: chatInput }];
    setMessages(next); setChatInput(""); setBusy("thinking");
    try {
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ persona, messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      setMessages([...next, { role: "assistant", content: data.answer, verified: data.verified, mock: data.mock }]);
    } catch (e: any) { setError(e.message); } finally { setBusy(""); }
  }

  async function forge() {
    if (!persona || !address) return;
    setError(""); setBusy("forging");
    try {
      // 0. make sure the wallet is on 0G Galileo, not Ethereum mainnet.
      // Always switch — it's a no-op if already on Galileo, and robust regardless
      // of what useChainId reports for an out-of-config network.
      setBusy("switching");
      await switchChainAsync({ chainId: galileo.id });

      // 1. server: encrypt shem → 0G Storage, build+store public card
      setBusy("forging");
      const r = await fetch("/api/forge", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ persona }),
      });
      const f = await r.json();
      if (!r.ok) throw new Error(f.error);

      // 2. browser wallet: mint the golem INFT
      setBusy("minting");
      const hash = await writeContractAsync({
        chainId: galileo.id,
        address: GOLEM_ADDRESS as `0x${string}`,
        abi: GOLEM_ABI,
        functionName: "mint",
        args: [address, f.tokenURI, f.encryptedURI, f.metadataHash, f.personaHash],
      });

      // Wait for the receipt, robust to 0G public-RPC propagation lag (the read node
      // may not see the tx for a few seconds even though it's mined).
      let tokenId: string | null = null;
      try {
        const receipt = await publicClient!.waitForTransactionReceipt({
          hash, timeout: 120_000, pollingInterval: 2_000, retryCount: 20,
        });
        const logs = parseEventLogs({ abi: GOLEM_ABI, eventName: "Forged", logs: receipt.logs });
        tokenId = (logs[0] as any)?.args?.tokenId?.toString() ?? null;
      } catch {
        // receipt lagged — the tx is almost certainly mined; fall through to the counter
      }
      if (tokenId === null) {
        await new Promise((r) => setTimeout(r, 4000));
        const total = (await publicClient!.readContract({
          address: GOLEM_ADDRESS as `0x${string}`, abi: GOLEM_ABI, functionName: "totalMinted",
        })) as bigint;
        tokenId = (total - 1n).toString();
      }
      router.push(`/agent/${tokenId}`);
    } catch (e: any) { setError(e.message); setBusy(""); }
  }

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 48px" }}>
      <nav className="nav" style={{ padding: "22px 0" }}>
        <a href="/" className="brand">G<span className="z">0</span>LDEM</a>
        <div className="nav-links"><a href="/agent/0">Golems</a></div>
      </nav>
      <h1 className="display" style={{ fontSize: 38, margin: "20px 0 4px", letterSpacing: -0.5 }}>Forge a golem</h1>
      <p style={{ color: "#a59a86", marginTop: 0 }}>Write the <em>shem</em> — the word that animates it.</p>

      <section style={card}>
        <h2 style={h2}>1 · Vibe-code the shem</h2>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} style={input} />
        <button onClick={compile} style={btn} disabled={!!busy}>
          {busy === "compiling" ? "Compiling on 0G Compute…" : "Compile persona"}
        </button>
      </section>

      {persona && (
        <section style={card}>
          <h2 style={h2}>2 · Meet {persona.name}</h2>
          <div style={{ display: "flex", gap: 18 }}>
            <div style={{ width: 120, flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: sigil }} />
            <div style={{ fontSize: 14 }}>
              <div><b style={{ color: GOLD }}>{persona.name}</b> · {persona.type}</div>
              <div style={{ color: "#b8b09c", marginTop: 4 }}>{persona.bio}</div>
              <div style={{ color: "#8b8576", marginTop: 8, fontSize: 12 }}>
                {persona.adjectives?.join(" · ")}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ margin: "8px 0", textAlign: m.role === "user" ? "right" : "left" }}>
                <span style={{
                  display: "inline-block", padding: "8px 12px", borderRadius: 10, maxWidth: "80%",
                  background: m.role === "user" ? "#1f1a10" : "#15110a", color: "#ece7dc", fontSize: 14,
                }}>
                  {m.content}
                  {m.role === "assistant" && (
                    <span style={{ display: "block", marginTop: 6, fontSize: 11, color: m.verified ? "#9ad29a" : "#b9863f" }}>
                      {m.verified ? "✓ verified AI (0G Compute TEE)" : m.mock ? "○ unverified (dev — fund 0G Compute)" : "○ unverified"}
                    </span>
                  )}
                </span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={`Say something to ${persona.name}…`} style={{ ...input, flex: 1 }} />
              <button onClick={send} style={btn} disabled={!!busy}>{busy === "thinking" ? "…" : "Send"}</button>
            </div>
          </div>
        </section>
      )}

      {persona && (
        <section style={card}>
          <h2 style={h2}>3 · Forge the INFT</h2>
          {!isConnected ? (
            <button onClick={() => connect({ connector: connectors[0] })} style={btn}>Connect wallet to forge</button>
          ) : (
            <button onClick={forge} style={{ ...btn, display: "inline-flex", alignItems: "center", gap: 8 }} disabled={!!busy}>
              {busy === "switching" ? "Switch wallet to 0G Galileo…" : busy === "forging" ? "Encrypting shem → 0G Storage…" : busy === "minting" ? "Minting on 0G Chain…" : <><Anvil size={17} /> Forge golem</>}
            </button>
          )}
          <p style={{ color: "#8b8576", fontSize: 12, marginTop: 10 }}>
            The shem is encrypted (AES-256-GCM) and stored on 0G Storage; only its hash goes on-chain.
          </p>
        </section>
      )}

      {error && <p style={{ color: "#ff8b8b", marginTop: 16 }}>⚠ {error}</p>}
    </main>
  );
}

const card: React.CSSProperties = { border: "1px solid #1f1a10", borderRadius: 14, padding: 22, marginTop: 20, background: "#0c0a06" };
const h2: React.CSSProperties = { fontSize: 13, textTransform: "uppercase", letterSpacing: 1, color: "#8b8576", marginTop: 0 };
const btn: React.CSSProperties = { background: GOLD, color: "#0c0a06", border: "none", borderRadius: 10, padding: "10px 16px", cursor: "pointer", fontSize: 14, fontWeight: 700 };
const input: React.CSSProperties = { width: "100%", background: "#08060300", border: "1px solid #2a2417", borderRadius: 10, padding: "10px 12px", color: "#ece7dc", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" };
