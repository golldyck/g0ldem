# G0LDEM — Ownable AI Agents on 0G

**Forge golden minds on 0G.** Vibe-code an AI golem → it gets an encrypted "brain" (the
*shem*: persona + skills + growing memory) → **forge** it as an **INFT (ERC-7857)** on 0G
→ **sell** it (the intelligence physically re-encrypts to the buyer) or **rent** it
(AI-as-a-Service without giving up ownership).

> **True AI Ownership vs API Access.** Built for the 0G **Zero Cup** vibe-coding tournament.
> **Live demo:** https://g0ldem-production.up.railway.app
>
> Full product spec: [`SPEC.md`](./SPEC.md). Build plan & tournament calendar: [`PLAN.md`](./PLAN.md).
> Brand & narrative (name decode, lore, pitch): [`BRAND.md`](./BRAND.md).
> Product logic, utility & burn rituals (vs the biggest projects): [`PRODUCT.md`](./PRODUCT.md).

**Name:** G0LDEM = **Gold** (value / top tier) + **Golem** (a forged being given a soul) +
**0G** (the golden zero). Lore ↔ tech: *shem* = encrypted brain, *forge* = mint,
*Soul Sigil* = deterministic avatar from `persona_hash`.

## Monorepo layout

```
goldem/
├── contracts/        # Hardhat — GolemINFT.sol (ERC721 → ERC-7857 in Phase 2)
├── packages/sdk/     # 0G Storage/Compute wrappers, AVS valuation  (Phase 1+)
├── apps/web/         # Next.js + wagmi/viem frontend
├── apps/api/         # Node/TS backend  (Phase 1+)
└── reference/        # 0gfoundation/0g-agent-nft @eip-7857-draft (study only, gitignored)
```

## Verified 0G facts (June 2026)

| Thing | Value |
|---|---|
| Testnet | 0G **Galileo** (V3) |
| Chain ID | **16602** (not 16601 — that's deprecated) |
| RPC | `https://evmrpc-testnet.0g.ai` |
| Explorer | `https://chainscan-galileo.0g.ai` |
| Faucet | `https://faucet.0g.ai` (0.1 0G/day, needs an X post) |
| Storage SDK | `@0gfoundation/0g-storage-ts-sdk` |
| Compute SDK | `@0gfoundation/0g-compute-ts-sdk` |
| Compute router | `https://router-api.0g.ai/v1` (OpenAI-compatible) |
| Default model | `zai-org/GLM-5-FP8` |

## Phase 0 — DONE ✅

GolemINFT compiles + 2 tests pass; frontend builds, connects a wallet and reads the
contract live. **Deployed to Galileo:** `0x48E5695b472a9E4286794eb458D3B1B47EF53508`
([explorer](https://chainscan-galileo.0g.ai/address/0x48E5695b472a9E4286794eb458D3B1B47EF53508)).

### Run it
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

## Security notes (SPEC §4)
- Encrypted shem only — plaintext never written to Storage/logs.
- Private keys live in `.env` (gitignored) / wallet, never in code or commits.
- `ReentrancyGuard` on mint; proof verification + nonce/expiry land in Phase 2 transfer.
