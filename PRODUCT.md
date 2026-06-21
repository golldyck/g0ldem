# G0LDEM — Product Logic, Utility & Burn Rituals

How G0LDEM actually works, why a golem is worth holding and using (not just
speculating on), and how golems are destroyed in a way no other project does.
Positioned against the biggest comparable projects, with their mistakes designed out.

---

## 1. The one-sentence thesis

> Every "crypto AI agent" today is a **token that floats free of the intelligence it
> points at** — you own a meme, not a mind. **G0LDEM makes the golem itself the asset:**
> you own the encrypted brain (ERC-7857), its quality is cryptographically provable
> (0G Compute TEE), and it earns, evolves, fuses, and can be ritually destroyed.

**True AI Ownership vs API Access.**

---

## 2. What a golem *is* (the object)

A golem = **persona + skills + growing memory + verifiable activity log**, sealed as an
encrypted **shem** (the word that animates it) on 0G Storage. On-chain, the INFT holds
only the pointer + integrity hash + the public passport card. The brain is private,
portable, and provably the agent's.

| 0G primitive | Role — and it does *real* work (remove it and the product breaks) |
|---|---|
| **0G Chain** | ownership (ERC-7857), marketplace/escrow, AVS commitments, burn rituals |
| **0G Storage** | the encrypted shem (AES-256-GCM); only its hash touches chain |
| **0G Compute (TEE)** | verified inference + the proofs that make the AVS un-fakeable |
| **Oracle (ERC-7857)** | re-encrypts the brain to the buyer on sale — the mind physically moves |

---

## 3. The lifecycle (detailed logic, end to end)

```
   WRITE THE SHEM ──► FORGE ──► USE & LEARN ──► TRAIN (AVS↑) ──► EARN ──► TRADE
        │ vibe-code      │ mint INFT   │ verified      │ tier rises   │ rent     │ brain
        │ → 0G Compute   │ shem→Storage│ inference     │ card evolves │ (AIaaS)  │ re-encrypts
        │ compiles       │ hash on-    │ memory grows  │ (dynamic     │ income   │ to buyer
        │ persona        │ chain       │ (learn())     │  NFT)        │          │
        └────────────────┴─────────────┴───────────────┴──────────────┴──────────┘
                                          │
                         COMPOSE / END ◄──┘
                         ├─ FUSE   (burn 2 → 1 stronger golem)
                         ├─ REBIRTH(burn → re-roll persona, keep lineage+AVS)
                         └─ UNMAKE (burn → return to clay, permanent)
```

1. **Write the shem** — describe the golem in a sentence; 0G Compute compiles an
   ElizaOS-style persona. Preview-chat before committing.
2. **Forge** — encrypt the shem → 0G Storage; commit `metadataHash` + `personaHash`
   on-chain; render the deterministic **Soul Sigil**; `mint()` the INFT.
3. **Use & learn** — every chat runs in a TEE; the response is signed (the "verified AI"
   proof). `learn()` appends to the encrypted memory → the golem grows.
4. **Train → AVS rises** — accumulated verified use raises the **Agent Value Score**;
   the card's tier evolves Bronze → Silver → Gold → Prismatic (dynamic NFT).
5. **Earn** — `authorizeUsage()` rents the golem (AI-as-a-Service) without giving up
   ownership; the owner collects income.
6. **Trade** — on sale, the oracle re-encrypts the brain to the buyer's key and the old
   key is invalidated: the seller **loses access**, the buyer **gains it**. The mind moved.
7. **Compose / End** — Fuse, Rebirth, or Unmake (section 5).

---

## 4. Utility — why hold and *use* a golem (designed against pure speculation)

The research lesson from Virtuals/STEPN/Olympus: **value survives only when demand is
tied to real usage and supply is constrained by that same usage** — never when emissions
pay for activity that exists only to farm emissions. G0LDEM's utility layers all bind to
real use:

1. **Use it** — a companion, analyst, creator, or assistant that actually does work. The
   floor utility: it's a useful agent you own outright.
2. **Rent it (AIaaS) — the income engine.** Borrow Story Protocol's license dials, but
   enforce them per-call inside the 0G TEE (the gap Story can't close on-chain):
   - `accessFee` (per call / per period), `expiration` (time-boxed), `rateLimit`,
     `allowedOperations`, `revShare` (cut of what the renter earns with it),
     `attribution` ("powered by this golem"). Renter never gets the key — only TEE-gated
     inference. Owner earns; G0LDEM takes a protocol fee (a sink).
3. **Fractionalize the income** — 100 royalty shares per golem (Story's vault model):
   sell a slice of a golem's rental cash-flow without selling the golem.
4. **Train → appreciate** — verified use raises AVS → higher rent + resale. Progression
   is path-dependent (a Gold golem with 10k verified chats can't be bought, only built).
5. **Compose** — Fuse and Rebirth are crafting utilities (section 5).
6. **Reputation that sticks** — the **owner's** track record (AVS lineage, successful
   rentals) is **soulbound to the wallet**; the golem stays tradable. Reputation can't be
   wash-traded, which gates premium features and anti-sybil rewards.

**Pay-for-verified-activity (anti-idle), borrowed from Olas/Bittensor:** rewards/AVS
accrue for *verifiable* activity inside the TEE, not for merely holding — so you can't
farm value with a dormant golem, and you can't fake a track record.

---

## 5. The burn — three rituals, not a delete button 🔥

A golem that has **learned** carries emotional weight: burning it destroys real,
accumulated, provable memory and track record. That makes destruction a *ritual* (the
strongest kind, per Pak "Merge", MAYC serum, the livestreamed Banksy burn) — not a
spreadsheet row deletion. All three are native to golem mythology: a golem is deactivated
by removing its shem, and golems can be reforged.

### 5.1 UNMAKE — "Return to Clay" (the signature ritual)
Burn a golem → the shem is **permanently destroyed**: the encryption key is invalidated
and the brain on 0G Storage is provably unrecoverable (key-shredding; the oracle attests
erasure). The golem crumbles back to clay.
- **What survives:** a soulbound **Epitaph** token — an on-chain gravestone recording the
  golem's name, persona_hash, final AVS, lifetime verified interactions and revenue. Its
  intelligence is gone forever, but its *legend* is permanent and provable (à la Pak ASH).
- **What you reclaim:** the golem's accumulated **Clay** (a portion of its locked value /
  essence) is returned to the owner — a reason to unmake rather than abandon.
- **Why it's special:** it is the only marketplace where deleting an NFT means destroying a
  *unique, verifiably-trained intelligence* — irreversibly, on the record. Supply leaves
  forever (hard deflation, not a lock). This is the demo line judges remember: *"I don't
  hide it — I end it, and prove the mind is gone."*

### 5.2 FUSE — "Reforge" (burn 2 → 1, MAYC-serum model)
Sacrifice one golem to strengthen another: the surviving golem **merges** the consumed
golem's memory + skills, and its AVS combines (with a fusion bonus and diminishing
returns). The consumed shem is destroyed as fuel.
- Creates an **ingredient market** (cheap/abandoned golems become fuel), a desirability
  gradient, and net deflation — *provided mints stay below fuses* (a tracked invariant).
- Lore: two clays kneaded together; two shems spoken as one greater word.

### 5.3 REBIRTH — "Phoenix" (burn → re-roll, keep the lineage)
Burn a stale golem to re-mint it with a fresh persona/skills/sigil **while preserving its
accumulated AVS, memory, and lineage** (parent hash recorded). For when the training is
valuable but the character is outdated. Narrative progression with provable ancestry.

> **Burn invariant (value retention):** fusing + unmaking must net-remove supply faster
> than forging adds it, and burns are **hard** (key-shredded / token-burned), never
> locked or recycled. The protocol surfaces the live mint-vs-burn ratio so the deflation
> is real, not theatre.

---

## 6. The economy (sinks, revenue, and what we deliberately avoid)

**Demand is bound to real usage; value capture is mandatory and revenue-backed.**

| Flow | Type | Note |
|---|---|---|
| Forge (mint) | fee → sink | small; spam-resistance |
| Inference / chat | real cost | pays 0G Compute (TEE) directly |
| Rent (AIaaS) | revenue | owner earns; protocol fee = sink |
| Marketplace trade | fee → sink | on secondary sales |
| Fuse / Rebirth | fee + **burn** | crafting sinks; net deflation |
| Unmake | **permanent burn** | supply leaves forever; reclaim Clay |
| Buy-back-and-burn | sink | funded **only by real protocol revenue** (Aave/Hyperliquid model), hard burn — never a lock or treasury one-off |

**What we deliberately avoid (the graveyard of the research):**
- ❌ A platform token that floats free of the product and "does governance" — that's the
  Virtuals/ElizaOS fatal flaw (value became pure sentiment; −90% to −97%). Value accrues
  to the **golem** (the asset) and to **verifiable activity**, not to a meme token.
- ❌ Rewards paid in the same currency you grind for (STEPN/Olympus reflexive death-spiral).
- ❌ Advisory royalties (EIP-2981 collapsed to ~0%) — rental/usage is **TEE-enforced**, not a polite request.
- ❌ "Lock ≠ burn / distribute ≠ remove" theatre — only true, provable burns count.

*(Hackathon scope: no separate token is required — fees in native 0G, Clay/Epitaph as
in-system resources. A revenue-backed `$GOLD` can come later, designed by these rules.)*

---

## 7. The moat: Agent Value Score (the merit economy 0G itself lacks)

0G ships ownership + transfer rails but **no on-chain quality ranking** — proving a brain
*actually has* its claimed capabilities (vs. being an opaque encrypted blob) is unsolved
at the standard level. **AVS is exactly that missing layer**, and only G0LDEM's TEE-backed
inputs make it un-fakeable:

```
AVS = w1·log(1 + verified_interactions)      // TEE-signed, can't be botted
    + w2·verified_track_record               // 0..1, proven by Compute proofs
    + w3·reputation                          // ratings weighted by *verified* usage
    + w4·log(1 + cumulative_revenue)         // on-chain rental income
    + w5·capability_rarity                   // skills / persona rarity
```

- **Anti-collusion ranking** borrowed from **Bittensor's Yuma consensus** (stake-weighted
  median + outlier-clipping) so reputation can't be brigaded.
- **KPI-gated, not holding-gated** (Olas Proof-of-Active-Agent): you earn standing by
  *doing verifiable work*, not by sitting on the asset.
- Every AVS input commits a hash on-chain/Storage → **anyone can recompute and verify** a
  golem's price. Virtuals' "track record" is a claim; ours is a proof.

---

## 8. How we beat the biggest projects (one line each)

| Project | Their fatal gap | G0LDEM's answer |
|---|---|---|
| **Virtuals** | token ≠ the agent; value sentiment-driven; agents are "wrappers" | you own the **brain** (ERC-7857); value from **verifiable** AVS |
| **ai16z / ElizaOS** | token floats free of a great framework; couldn't even prove autonomy | value tied to **TEE-proven** activity; the asset *is* the agent |
| **Story Protocol** | great license/royalty rails, but metering is **off-chain** | same license dials, but **per-call enforced in 0G TEE** |
| **Bittensor / Olas** | merit economies, but not *ownable, tradable* agents | borrow their scoring/KPI rewards; wrap them in an **ownable INFT** |
| **0G itself** | ownership rails, **no merit/quality economy** | **AVS** is that missing layer + the burn-ritual game economy |

---

## 9. Build implications (maps onto the tournament phases)

- **Now (Phase 1, shipped):** forge → verified chat → INFT → card.
- **Phase 2:** secure transfer (oracle re-encryption) — the "mind moves" demo.
- **Phase 3:** AVS from verifiable inputs + marketplace + **Unmake (Return to Clay)** as
  the signature burn (an Epitaph mint + reclaim).
- **Phase 4:** rental (TEE-enforced license dials) + **Fuse** + **Rebirth** + the 30-sec
  viral demo (forge → prove → sell → unmake on the record).

> The single most differentiated, demo-able combination: **own the brain + prove its
> quality + and be able to ritually end it.** No competitor can show all three.
