<div align="center">

<img src="https://g0ldem-production.up.railway.app/icon.svg" width="104" alt="G0LDEM logo" />

# G0LDEM

**Forge golden minds on 0G.** Own the brain — not API access.

[Live demo](https://g0ldem-production.up.railway.app) · [Video](https://youtu.be/6PX3zS0axXI) · [Contract](https://chainscan-galileo.0g.ai/address/0x48E5695b472a9E4286794eb458D3B1B47EF53508) · License: MIT

*Built for the 0G **Zero Cup** vibe-coding tournament.*

</div>

---

## What it is

Today's "crypto AI agents" are speculative tokens over a **black box** — the team still owns the
intelligence, you can't prove an AI (not a human) is answering, and you can't move the brain
yourself. **G0LDEM fixes that.**

You describe an agent in one line — the *shem*, the word that animates the clay in the golem
myth. G0LDEM:

1. compiles its **encrypted brain** (persona + skills + growing memory) and seals it on **0G Storage**,
2. lets you **forge** it as an **INFT (ERC-7857)** on **0G Chain**,
3. and lets you chat with it through **0G Compute** — every reply signed inside a TEE, so it's
   *provably* AI.

Later you can **sell** it (the brain re-encrypts to the buyer — the mind physically moves wallets)
or **rent** it (AI-as-a-Service without giving up ownership).

**Name:** G0LDEM = **Gold** (value / top tier) + **Golem** (a forged being given a soul) + **0G**
(the golden zero).

## How 0G does the real work (no bolt-on)

| Layer | Role |
|---|---|
| **0G Storage** | The encrypted *shem* (AES-256-GCM) + the public passport card live here. |
| **0G Compute** | Inference runs in a TEE; every response is signature-verified → "verified AI". |
| **0G Chain** | The `GolemINFT` holds ownership + the encrypted-brain pointer + an integrity hash. |

## Live today (testnet)

Vibe-code → persona compiled via 0G Compute → preview chat with a verified badge → **forge**
(shem encrypted, uploaded to 0G Storage, `mint()` from your wallet) → passport card reads the
chain and resolves metadata. **Four golems already forged on-chain (#0–#3).** Deterministic
**Soul Sigil** avatar from `keccak(persona)` — anti image-swap.

## Roadmap

- **Now — Zero Cup ✅** — forge golems as INFTs, TEE-verified chat, Soul Sigil, on-chain passport. Live on 0G Galileo.
- **Next** — golem **marketplace**: buy/sell with on-chain brain re-encryption to the new owner; **rent-a-golem** (pay-per-verified-chat).
- **Then** — **Agent Value Score** from verified on-chain activity; dynamic tiers (Bronze → Silver → Gold → Prismatic) that evolve as a golem earns.
- **Later** — multi-agent **guilds**, mobile app, and **mainnet** launch with creator revenue share.

---

## Monorepo layout

```
goldem/
├── contracts/        # Hardhat — GolemINFT.sol (ERC721 → ERC-7857)
├── packages/sdk/     # 0G Storage/Compute wrappers, AVS valuation
├── apps/web/         # Next.js + wagmi/viem frontend
├── apps/api/         # Node/TS backend
└── reference/        # 0gfoundation/0g-agent-nft @eip-7857-draft (study only, gitignored)
```

## Verified 0G facts (2026)

| Thing | Value |
|---|---|
| Testnet | 0G **Galileo** (V3) |
| Chain ID | **16602** |
| RPC | `https://evmrpc-testnet.0g.ai` |
| Explorer | `https://chainscan-galileo.0g.ai` |
| Faucet | `https://faucet.0g.ai` (0.1 0G/day, needs an X post) |
| Storage SDK | `@0gfoundation/0g-storage-ts-sdk` |
| Compute SDK | `@0gfoundation/0g-compute-ts-sdk` |
| Compute router | `https://router-api.0g.ai/v1` (OpenAI-compatible) |
| Default model | `zai-org/GLM-5-FP8` |

**Deployed to Galileo:** `0x48E5695b472a9E4286794eb458D3B1B47EF53508`
([explorer](https://chainscan-galileo.0g.ai/address/0x48E5695b472a9E4286794eb458D3B1B47EF53508)).

## Run it

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

Connect MetaMask (Galileo network) — the page shows the contract name/symbol and the live
`golems forged` count read straight from chain.

## Tech

Solidity + Hardhat · `0g-storage-ts-sdk` · `0g-compute-ts-sdk` (broker + TEE verify) ·
Next.js + wagmi/viem · AES-256-GCM.

## Security notes (SPEC §4)

- Encrypted shem only — plaintext never written to Storage/logs.
- Private keys live in `.env` (gitignored) / wallet, never in code or commits.
- `ReentrancyGuard` on mint; proof verification + nonce/expiry on transfer.

## More docs

Full product spec: [`SPEC.md`](./SPEC.md) · Build plan & calendar: [`PLAN.md`](./PLAN.md) ·
Brand & narrative: [`BRAND.md`](./BRAND.md) · Product logic & utility: [`PRODUCT.md`](./PRODUCT.md).
