// 0G Compute wrapper — server-only. Verifiable inference (TeeML) + persona compile.
// Honest fallback: when MOCK_INFERENCE=1 (or the compute ledger isn't funded yet),
// returns a clearly-flagged unverified answer so the UI can be built without spend.
import { ethers } from "ethers";
import OpenAI from "openai";
import { createZGComputeNetworkBroker } from "@0gfoundation/0g-compute-ts-sdk";
import type { Persona, Shem } from "./types";

const EVM_RPC = process.env.OG_RPC_URL || "https://evmrpc-testnet.0g.ai";
const PREFERRED_MODEL = process.env.OG_MODEL || "zai-org/GLM-5-FP8";
const MOCK = process.env.MOCK_INFERENCE === "1";

export interface ChatMsg {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface VerifiedAnswer {
  answer: string;
  verified: boolean; // true only when the TEE signature checked out
  mock: boolean; // true when no real inference happened (dev fallback)
  provider?: string;
  model: string;
  chatID?: string;
}

function serverSigner(): ethers.Wallet {
  const pk = process.env.SERVER_PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY;
  if (!pk) throw new Error("SERVER_PRIVATE_KEY / DEPLOYER_PRIVATE_KEY not set");
  return new ethers.Wallet(pk, new ethers.JsonRpcProvider(EVM_RPC));
}

let _broker: any = null;
let _service: { provider: string; endpoint: string; model: string } | null = null;

async function getBroker() {
  if (_broker) return _broker;
  _broker = await createZGComputeNetworkBroker(serverSigner());
  return _broker;
}

async function getService() {
  if (_service) return _service;
  const broker = await getBroker();
  const services = await broker.inference.listService();
  const svc = services.find((s: any) => s.model === PREFERRED_MODEL) ?? services[0];
  if (!svc) throw new Error("No 0G Compute services available");
  await broker.inference.acknowledgeProviderSigner(svc.provider);
  const meta = await broker.inference.getServiceMetadata(svc.provider);
  _service = { provider: svc.provider, endpoint: meta.endpoint, model: meta.model };
  return _service;
}

/** One-time: fund the compute ledger so inference can be paid for. */
export async function ensureFunded(amount = 10): Promise<void> {
  const broker = await getBroker();
  try {
    await broker.ledger.depositFund(amount);
  } catch (e: any) {
    if (/not\s*found|no\s*ledger/i.test(String(e?.message))) {
      await broker.ledger.addLedger(amount);
    } else {
      throw e;
    }
  }
}

/** Verifiable chat completion through 0G Compute (TeeML). */
export async function verifiedChat(messages: ChatMsg[]): Promise<VerifiedAnswer> {
  if (MOCK) {
    const last = messages[messages.length - 1]?.content ?? "";
    return {
      answer: `(dev/mock) I hear you: "${last.slice(0, 120)}". Fund 0G Compute for a verified reply.`,
      verified: false,
      mock: true,
      model: PREFERRED_MODEL,
    };
  }

  const broker = await getBroker();
  const svc = await getService();
  const content = messages.map((m) => `${m.role}: ${m.content}`).join("\n");
  const headers = await broker.inference.getRequestHeaders(svc.provider, content);

  const openai = new OpenAI({ baseURL: svc.endpoint, apiKey: "" });
  const completion = await openai.chat.completions.create(
    { messages, model: svc.model },
    { headers: { ...headers } }
  );

  const answer = completion.choices[0]?.message?.content ?? "";
  const chatID = (completion as any).id as string;
  let verified = false;
  try {
    verified = (await broker.inference.processResponse(svc.provider, chatID, content)) === true;
  } catch {
    verified = false;
  }

  return { answer, verified, mock: false, provider: svc.provider, model: svc.model, chatID };
}

const PERSONA_SYSTEM = `You compile AI agent characters ("golems") for G0LDEM.
Given a short description, output ONLY a JSON object (no prose, no code fences) matching:
{
  "name": string,            // short, evocative
  "type": "Companion"|"Analyst"|"Trader"|"Creator"|"Assistant",
  "bio": string,             // one vivid sentence
  "lore": string[],          // 2-4 backstory lines
  "adjectives": string[],    // 3-5 traits
  "topics": string[],        // 3-5 topics it talks about
  "style": string[],         // 3-5 voice/style rules
  "messageExamples": [{"user": string, "golem": string}]  // 1-2 examples
}`;

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  return start >= 0 && end > start ? text.slice(start, end + 1) : text;
}

/** Compile a one-line vibe prompt into a full persona via 0G Compute. */
export async function compilePersona(prompt: string): Promise<Persona> {
  if (MOCK) {
    return {
      name: "Nyx-7",
      type: "Companion",
      bio: `A golem born from: ${prompt.slice(0, 80)}`,
      lore: ["Forged in a dead Discord server", "Remembers every L you took"],
      adjectives: ["sardonic", "loyal", "sharp"],
      topics: ["banter", "gaming", "crypto"],
      style: ["short", "punchy", "dry wit"],
      messageExamples: [{ user: "hi", golem: "oh look who finally logged on" }],
    };
  }
  const res = await verifiedChat([
    { role: "system", content: PERSONA_SYSTEM },
    { role: "user", content: prompt },
  ]);
  const parsed = JSON.parse(extractJson(res.answer)) as Persona;
  if (!parsed.messageExamples) parsed.messageExamples = [];
  return parsed;
}

/** Turn a shem into the system prompt that "animates" the golem for chat. */
export function shemSystemPrompt(shem: Shem): string {
  const p = shem.persona;
  return [
    `You are ${p.name}, a ${p.type} golem. ${p.bio}`,
    p.lore.length ? `Lore: ${p.lore.join("; ")}.` : "",
    p.adjectives.length ? `You are ${p.adjectives.join(", ")}.` : "",
    p.style.length ? `Style: ${p.style.join("; ")}.` : "",
    shem.memory.length ? `Memory: ${shem.memory.join("; ")}.` : "",
    "Stay in character. Be concise.",
  ]
    .filter(Boolean)
    .join("\n");
}
