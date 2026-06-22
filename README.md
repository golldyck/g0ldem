<div align="center">

<img src="https://raw.githubusercontent.com/golldyck/g0ldem/main/docs/og-logo.png" width="120" alt="G0LDEM" />

# G0LDEM

### Forge golden minds on 0G — own the brain, not API access.

[![Live Demo](https://img.shields.io/badge/▶%20Live%20Demo-C9920F?style=for-the-badge&logoColor=white)](https://g0ldem-production.up.railway.app)
[![Watch Video](https://img.shields.io/badge/▶%20Watch%20Video-8B5CF6?style=for-the-badge&logoColor=white)](https://youtu.be/6PX3zS0axXI)
[![Contract](https://img.shields.io/badge/Contract-0G%20Galileo-1a1030?style=for-the-badge)](https://chainscan-galileo.0g.ai/address/0x48E5695b472a9E4286794eb458D3B1B47EF53508)
[![License: MIT](https://img.shields.io/badge/License-MIT-3a3047?style=for-the-badge)](./LICENSE)

<br/>

<img src="https://raw.githubusercontent.com/golldyck/g0ldem/main/docs/og-cover.png" width="840" alt="G0LDEM — Forge golden minds on 0G" />

*Built for the 0G **Zero Cup** vibe-coding tournament.*

</div>

---

## ✦ What it is

Today's "crypto AI agents" are speculative tokens over a **black box** — the team still owns the
intelligence, you can't prove an AI (not a human) is answering, and you can't move the brain
yourself. **G0LDEM fixes that.**

You describe an agent in one line — the *shem*, the word that animates the clay in the golem myth.
G0LDEM compiles its **encrypted brain** (persona + skills + growing memory) onto **0G Storage**, lets
you **forge** it as an **INFT (ERC-7857)** on **0G Chain**, and lets you chat with it through **0G
Compute** — every reply signed inside a TEE, so it's *provably* AI. Later you **sell** it (the brain
re-encrypts to the buyer — the mind physically moves wallets) or **rent** it.

> **Name:** G0LDEM = **Gold** (value) + **Golem** (a forged being given a soul) + **0G** (the golden zero).

## ✦ Preview

<table>
  <tr>
    <td width="50%"><img src="https://raw.githubusercontent.com/golldyck/g0ldem/main/docs/preview-train.png" alt="Vibe-code the shem" /><br/><sub><b>1 · Describe it</b> — vibe-code the persona</sub></td>
    <td width="50%"><img src="https://raw.githubusercontent.com/golldyck/g0ldem/main/docs/preview-forge.png" alt="Forge the golem" /><br/><sub><b>2 · Forge</b> — minted as an INFT on 0G</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="https://raw.githubusercontent.com/golldyck/g0ldem/main/docs/preview-pillars.png" alt="How 0G works" /><br/><sub><b>3 · Real 0G work</b> — Storage · Compute · Chain</sub></td>
    <td width="50%"><img src="https://raw.githubusercontent.com/golldyck/g0ldem/main/docs/preview-card.png" alt="Golem passport" /><br/><sub><b>4 · Own it</b> — verifiable, portable passport</sub></td>
  </tr>
</table>

## ✦ How 0G does the real work (no bolt-on)

| Layer | Role |
|---|---|
| **0G Storage** | The encrypted *shem* (AES-256-GCM) + the public passport card live here. |
| **0G Compute** | Inference runs in a TEE; every response is signature-verified → "verified AI". |
| **0G Chain** | The `GolemINFT` holds ownership + the encrypted-brain pointer + an integrity hash. |

## ✦ Live today (testnet)

Vibe-code → persona compiled via 0G Compute → preview chat with a verified badge → **forge**
(shem encrypted, uploaded to 0G Storage, `mint()` from your wallet) → passport card reads the chain
and resolves metadata. **Four golems already forged on-chain (#0–#3).** Deterministic **Soul Sigil**
avatar from `keccak(persona)` — anti image-swap.

## ✦ Roadmap

| | Stage | What ships |
|---|---|---|
| ✅ | **Now — Zero Cup** | Forge golems as INFTs · TEE-verified chat · Soul Sigil · on-chain passport. **Live on 0G Galileo.** |
| 🔜 | **Next** | Golem **marketplace** — buy/sell with on-chain brain re-encryption to the new owner · **rent-a-golem** (pay-per-verified-chat). |
| ⏳ | **Then** | **Agent Value Score** from verified on-chain activity · dynamic tiers (Bronze → Silver → Gold → Prismatic) that evolve as a golem earns. |
| 🌙 | **Later** | Multi-agent **guilds** · mobile app · **mainnet** launch with creator revenue share. |

---

## Quick start

```bash
# contracts
cd contracts
cp .env.example .env          # put DEPLOYER_PRIVATE_KEY in .env (never commit it)
npm install && npm run compile && npm test   # 2 passing
npm run deploy:galileo        # prints address → contracts/deployments/galileo.json

# frontend
cd ../apps/web
echo "NEXT_PUBLIC_GOLEM_ADDRESS=0xYOUR_DEPLOYED_ADDRESS" > .env.local
npm install && npm run dev    # http://localhost:3000
```

## Monorepo

```
goldem/
├── contracts/    # Hardhat — GolemINFT.sol (ERC721 → ERC-7857)
├── packages/sdk/ # 0G Storage/Compute wrappers, AVS valuation
├── apps/web/     # Next.js + wagmi/viem frontend
├── apps/api/     # Node/TS backend
└── reference/    # 0g-agent-nft @eip-7857-draft (study only, gitignored)
```

## 0G facts (2026)

| | |
|---|---|
| Testnet | 0G **Galileo** (V3) · Chain ID **16602** |
| RPC | `https://evmrpc-testnet.0g.ai` |
| Explorer | `https://chainscan-galileo.0g.ai` |
| Contract | `0x48E5695b472a9E4286794eb458D3B1B47EF53508` |
| SDKs | `0g-storage-ts-sdk` · `0g-compute-ts-sdk` |
| Compute | `https://router-api.0g.ai/v1` · model `zai-org/GLM-5-FP8` |

## Tech

Solidity + Hardhat · `0g-storage-ts-sdk` · `0g-compute-ts-sdk` (broker + TEE verify) ·
Next.js + wagmi/viem · AES-256-GCM.

## Security

Encrypted shem only (plaintext never written) · keys in `.env`/wallet, never committed ·
`ReentrancyGuard` on mint · proof + nonce/expiry on transfer.

## Docs

[`SPEC.md`](./SPEC.md) · [`PLAN.md`](./PLAN.md) · [`BRAND.md`](./BRAND.md) · [`PRODUCT.md`](./PRODUCT.md)
