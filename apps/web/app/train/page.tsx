"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useConnect, useWriteContract, usePublicClient, useSwitchChain } from "wagmi";
import { parseEventLogs } from "viem";
import { galileo } from "@/lib/chain";
import { GOLEM_ADDRESS, GOLEM_ABI } from "@/lib/contract";
import type { Persona } from "@goldem/sdk/src/types";
import { Anvil, Verified, Lock, Sigil, ArrowRight } from "../_components/Icons";
import { Logo } from "../_components/Logo";

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

  const step = persona ? (busy === "minting" || busy === "forging" || busy === "switching" ? 3 : 2) : 1;

  async function compile() {
    setError(""); setBusy("compiling"); setPersona(null); setMessages([]);
    try {
      const r = await fetch("/api/compile", {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ prompt }),
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
    setError(""); setBusy("switching");
    try {
      await switchChainAsync({ chainId: galileo.id });
      setBusy("forging");
      const r = await fetch("/api/forge", {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ persona }),
      });
      const f = await r.json();
      if (!r.ok) throw new Error(f.error);

      setBusy("minting");
      const hash = await writeContractAsync({
        chainId: galileo.id, address: GOLEM_ADDRESS as `0x${string}`, abi: GOLEM_ABI, functionName: "mint",
        args: [address, f.tokenURI, f.encryptedURI, f.metadataHash, f.personaHash],
      });

      let tokenId: string | null = null;
      try {
        const receipt = await publicClient!.waitForTransactionReceipt({ hash, timeout: 120_000, pollingInterval: 2_000, retryCount: 20 });
        const logs = parseEventLogs({ abi: GOLEM_ABI, eventName: "Forged", logs: receipt.logs });
        tokenId = (logs[0] as any)?.args?.tokenId?.toString() ?? null;
      } catch { /* receipt lag — fall through to counter */ }
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
    <>
      <div className="bg-fx"><div className="orb o1" /><div className="orb o2" /><div className="grid-fx" /><div className="grain" /></div>

      <nav className="nav">
        <div className="nav-in">
          <Logo />
          <div className="nav-links"><a href="/">Home</a><a href="/agent/0">Golems</a></div>
        </div>
      </nav>

      <main className="wrap" style={{ maxWidth: 720, paddingBottom: 64 }}>
        <div className="forge-head">
          <div className="eyebrow"><Anvil size={14} /> Forge ritual</div>
          <h1>Forge a golem</h1>
          <p>Write the <em>shem</em> — the word that animates the clay.</p>
        </div>

        {/* stepper */}
        <div className="stepper" aria-label={`Step ${step} of 3`}>
          <Stepper n={1} label="Shem" step={step} />
          <Bar fill={step > 1} />
          <Stepper n={2} label="Meet" step={step} />
          <Bar fill={step > 2} />
          <Stepper n={3} label="Forge" step={step} />
        </div>

        {/* STEP 1 — vibe code */}
        <section className="fcard">
          <div className="step-label"><span className="num">01</span> Vibe-code the shem</div>
          <label className="flabel" htmlFor="shem">Describe your golem in one sentence</label>
          <textarea id="shem" className="finput" rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. a stoic on-chain oracle that speaks in riddles" />
          <div style={{ marginTop: 14 }}>
            <button className="btn" onClick={compile} disabled={!!busy}>
              {busy === "compiling" ? <><span className="typing"><i /><i /><i /></span> Compiling on 0G Compute…</> : <>Compile persona <ArrowRight size={16} /></>}
            </button>
          </div>
          <div className="fhint">Compiled into an ElizaOS-style character via 0G Compute. You can edit and recompile freely.</div>
        </section>

        {/* STEP 2 — meet + chat */}
        {persona && (
          <section className="fcard">
            <div className="step-label"><span className="num">02</span> Meet your golem</div>
            <div className="meet">
              <div className="av" dangerouslySetInnerHTML={{ __html: sigil }} />
              <div>
                <span className="nm display">{persona.name}</span><span className="ty">{persona.type}</span>
                <p className="bio">{persona.bio}</p>
                <div className="adj">{persona.adjectives?.join(" · ")}</div>
              </div>
            </div>

            <div className="chat">
              {messages.map((m, i) => (
                <div key={i} className={`bubble-row ${m.role}`}>
                  <div className={`bubble ${m.role === "user" ? "user" : "golem"}`}>
                    {m.content}
                    {m.role === "assistant" && (
                      <div className={`proof ${m.verified ? "ok" : "no"}`}>
                        {m.verified ? <><Verified size={13} /> verified AI · 0G Compute TEE</> : <><Lock size={13} /> {m.mock ? "unverified · fund 0G Compute" : "unverified"}</>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {busy === "thinking" && <div className="bubble-row"><div className="bubble golem"><span className="typing"><i /><i /><i /></span></div></div>}
              <div className="chat-input">
                <label htmlFor="say" style={{ position: "absolute", left: -9999 }}>Message {persona.name}</label>
                <input id="say" className="finput" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()} placeholder={`Say something to ${persona.name}…`} />
                <button className="btn" onClick={send} disabled={!!busy} style={{ padding: "0 20px" }}>Send</button>
              </div>
            </div>
          </section>
        )}

        {/* STEP 3 — forge */}
        {persona && (
          <section className="fcard">
            <div className="step-label"><span className="num">03</span> Forge the INFT</div>
            {!isConnected ? (
              <button className="btn" onClick={() => connect({ connector: connectors[0] })}>Connect wallet to forge</button>
            ) : (
              <button className="btn lg" onClick={forge} disabled={!!busy}>
                {busy === "switching" ? "Switch to 0G Galileo…" : busy === "forging" ? <><span className="typing"><i /><i /><i /></span> Encrypting shem → 0G Storage…</> : busy === "minting" ? <><span className="typing"><i /><i /><i /></span> Minting on 0G Chain…</> : <><Anvil size={18} /> Forge golem</>}
              </button>
            )}
            <div className="forge-chips">
              <span className="c"><Lock size={15} /> shem AES-256 encrypted</span>
              <span className="c"><Sigil size={15} /> stored on 0G Storage</span>
              <span className="c"><Verified size={15} /> only the hash on-chain</span>
            </div>
          </section>
        )}

        {error && <div className="err-box">⚠ {error}</div>}
      </main>
    </>
  );
}

function Stepper({ n, label, step }: { n: number; label: string; step: number }) {
  const state = step > n ? "done" : step === n ? "active" : "";
  return (
    <div className={`s ${state}`}>
      <span className="b">{step > n ? "✓" : n}</span>
      <span>{label}</span>
    </div>
  );
}
function Bar({ fill }: { fill: boolean }) {
  return <span className={`bar ${fill ? "fill" : ""}`} />;
}
