# G0LDEM — Build Plan × Zero Cup Calendar

Single-elimination tournament. **Resubmission between rounds is allowed** — so we don't
build everything at once: each round we ship the next phase from `SPEC.md §7`.

| Deadline | Round | Ship | DoD |
|---|---|---|---|
| **Jun 23** | Group Stage | **Phase 1** — train → verifiable chat → forge INFT | describe golem → chat (with proof) → forge → see card |
| Jun 28 | Round of 32 | **Phase 2** — Secure Transfer (the money demo) | shem moves between wallets; seller loses access, buyer gains it |
| Jul 4 | Round of 16 | **Phase 3** — Valuation (AVS) + Marketplace | golem has a proof-explained price; can be listed & bought |
| **Jul 8** | Final lock | **Phase 4** — Rental (AIaaS) + polish + 30s demo | rent without ownership; polished viral demo |
| Jul 8–18 | ¼ / ½ / Final | Community voting | sharing cards, pitch visuals, leaderboard |
| Jul 19 | — | Champion announced | — |

Judges score rounds 1–3 against a per-round rubric (criteria not public). From the quarter
finals it is **pure community voting** → that's why Phase 4 prioritizes one emotional,
shareable demo golem (Companion / Roast-NPC).

## Status

- [x] **Phase 0 — DONE.** Monorepo, Hardhat (GolemINFT compiles, 2 tests pass), Galileo config (16602),
      Next.js + wagmi frontend builds, connects wallet & reads chain. **Deployed to Galileo: `0x48E5695b472a9E4286794eb458D3B1B47EF53508`**
      (deployer `0xeB2410566B57c31218644E57499627040771321F`). Gold brand (#C9920F) + golem lore applied.
- [~] **Phase 1 — built, validated server+UI.** Needs: (a) a wallet forge click to mint, (b) ~3-10 0G to fund 0G Compute for live verified chat (honest mock fallback until then).

### Phase 1 checklist
- [x] `packages/sdk` — shem types, AES-256-GCM crypto (roundtrip tested), deterministic Soul Sigil SVG, persona_hash, metadata assembly
- [x] `packages/sdk/storage.ts` — 0G Storage upload/download via `MemData` (real upload tested ✓)
- [x] `packages/sdk/inference.ts` — 0G Compute broker chat + persona compile + TEE `processResponse` verify; honest mock fallback (`MOCK_INFERENCE=1`)
- [x] route handlers `/api/{compile,chat,forge,resolve}` (forge does real 0G Storage upload of shem + card; resolve reads back ✓)
- [x] `apps/web/train` — vibe-code → compile → preview chat (verified/unverified badge) → forge
- [x] `apps/web/agent/[id]` — passport card: reads chain + resolves metadata from 0G Storage
- [x] **DONE:** forged golem #0 via MetaMask on Galileo — owner 0xeB2410…, shem + card on 0G Storage, card renders
- [ ] **user action:** fund 0G Compute (`broker.ledger.depositFund`) for genuine verified inference

### Fix log
- 0G Storage SDK 400 "Invalid header" was the nested `axios@0.27.2` in `open-jsonrpc-provider`
  sending a bad host header. Fixed via root `overrides: { axios: ^1.18.0 }` + clean lockfile.

## Hard scope guardrails (don't over-build)
- TEE mock oracle from the reference repo — no ZKP from scratch.
- ONE demo golem, not five types.
- Every 0G piece must do real work (Compute = proof, Storage = shem, Chain = ownership) —
  a bolt-on disqualifies.
