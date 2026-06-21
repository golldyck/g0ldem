# G0LDEM — Zero Cup submission

**Tagline:** Forge golden minds on 0G.
**One-liner:** Vibe-code an AI golem, forge it as an INFT, and own the intelligence
itself — verifiable, portable, private. Not API access.

**Repo:** https://github.com/golldyck/g0ldem
**Live:** https://g0ldem-production.up.railway.app
**Network:** 0G Galileo Testnet (chainId 16602)
**Contract (GolemINFT):** 0x48E5695b472a9E4286794eb458D3B1B47EF53508

---

## What it is

Today's "crypto AI agents" are speculative tokens over a black box: you buy the token,
but the team still owns the intelligence, you can't prove an AI (not a human) is answering,
and you can't move the "brain" yourself.

**G0LDEM fixes that.** You describe an agent in words (the *shem* — the word that, in the
golem myth, animates the clay). It gets an encrypted brain — persona + skills + growing
memory — sealed on **0G Storage**. You **forge** it as an **INFT (ERC-7857)** on **0G Chain**.
You can chat with it through **0G Compute** (each reply signed inside a TEE = provable AI),
and later sell it (the brain re-encrypts to the buyer — it physically moves) or rent it.

The differentiator judges and voters can feel: **True AI Ownership vs API Access.**

## Why the name

**G0LDEM** = **Gold** (from the founder Goldy) + **Golem** (a forged being given a soul and
owned) + **0G** (the golden zero). Reads as *gold 'em* — "own them, collect them." The golem
legend maps 1:1 onto the product: clay = the LLM on 0G Compute, *shem* = the encrypted brain,
forging = minting, removing the word = re-encrypting the brain to a new owner.

## How 0G does real work (no bolt-on)

- **0G Storage** — the encrypted shem (AES-256-GCM) lives here; only its keccak hash goes
  on-chain. The public passport card (with the Soul Sigil) is stored here too. Remove 0G
  Storage and there is no private, portable brain.
- **0G Compute** — inference runs in a TEE (TeeML); each response is signature-verified
  (`processResponse`) → the "verified AI" proof. Remove it and you can't prove it's the AI.
- **0G Chain** — the GolemINFT (ERC-721 → ERC-7857) holds ownership + the encrypted-brain
  pointer + integrity hash. Remove it and there is no ownership to trade.

## Live, working today (testnet)

- Vibe-code a golem → persona compiled via 0G Compute.
- Preview-chat with a verified/unverified proof badge.
- **Forge:** shem encrypted → uploaded to 0G Storage → public card uploaded → `mint()` from
  the user's wallet on 0G. Three golems already forged on-chain (#0–#2).
- **Passport card** `/agent/[id]` reads the chain and resolves metadata from 0G Storage.
- **Soul Sigil** — a deterministic SVG avatar from `keccak(persona)`; same persona → same
  sigil, fully reproducible and verifiable (anti image-swap).

## 30-second demo script

1. "Crypto AI agents are tokens over a black box — you don't own the mind." (landing)
2. Type a one-line shem → **Compile** → meet the golem + its Soul Sigil.
3. Chat one line → reply carries a "verified AI (0G Compute TEE)" badge.
4. **Forge** → wallet signs the mint on 0G → land on the passport card.
5. Point at the card: "the brain is AES-256 encrypted on 0G Storage, owned on 0G Chain —
   and next, when I sell it, the mind physically moves to the buyer." (Phase 2)

## Tech

Solidity + Hardhat (OpenZeppelin), `@0gfoundation/0g-storage-ts-sdk` (MemData in-memory
upload), `@0gfoundation/0g-compute-ts-sdk` (broker + TEE verify), Next.js + wagmi/viem,
AES-256-GCM, deterministic SVG sigils. Model: `zai-org/GLM-5-FP8`.

## Roadmap (tournament rounds)

- ✅ Phase 0/1 — train → verifiable chat → forge INFT → card (this submission)
- Phase 2 — secure transfer (oracle re-encryption: the brain moves on sale)
- Phase 3 — Agent Value Score from verifiable inputs + marketplace
- Phase 4 — rental (AIaaS, scoped/ revocable) + a polished viral demo golem
