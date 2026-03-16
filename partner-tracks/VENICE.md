# Venice

## Why it fits Hashapp
Venice is the strongest path for turning Hashapp from a spend-control shell into a system that bridges:
- **private cognition**
- **trusted public action**
- **human-controlled disclosure**

Hashapp already has the public-action layer:
- spending controls
- receipts
- approvals
- activity history
- agent identity

Venice can become the **private reasoning layer** behind those actions.

## Updated product stance
Venice should **not** be framed as a separate app mode or a gimmicky top-level feature.

### Not this
- "Venice Mode"
- a dedicated top-level Venice tab
- a neon privacy toggle that makes the product feel like a toy

### Yes to this
Venice should appear as an **agent capability** and a **reasoning provenance layer**.

That means the product should answer:
- which agent used private reasoning
- what kind of private inputs were used (text / image / audio)
- what public action resulted
- what was disclosed publicly vs kept private

## Product role
Venice is **not** the product.
Venice is the **private cognition engine** inside the product.

Hashapp remains:
- the spending app for AI agents
- the human-control surface
- the receipt / proof layer
- the place where permissions, activity, and trust are managed

Venice provides:
- private reasoning
- no-data-retention inference
- multimodal analysis
- sensitive due diligence / strategy / review before action

## Best integration pattern
### Agent-level privacy / reasoning configuration
Venice should be configured per agent, not as a global app theme.

Best surface:
- **Scout / Agent detail page**

Example section:
- Private reasoning: Enabled
- Provider: Venice
- Inputs allowed: Text / Vision / Audio
- Disclosure policy: Summary only
- Paid by: Hashapp (v1)

That is the mature version of the earlier toggle idea.

## UX integration points
### 1. Agent page
Add a dedicated **Private reasoning** or **Reasoning & Privacy** card.

Show:
- provider = Venice
- private reasoning enabled / disabled
- disclosure policy
- supported modalities
- last private analysis timestamp

### 2. Pending approval cards
Add a small **Reason summary** section that explains *why* the agent is asking, without exposing private raw inputs.

Example:
- Reason summary: Needed for Q2 energy report validation
- Reasoning provenance: Venice private analysis
- Raw inputs: hidden

### 3. Receipts
Add two fields for Venice-backed actions:
- **Reasoning provenance**
- **Disclosure summary**

Example:
- Reasoning provenance: Private analysis via Venice
- Disclosure summary: Vendor, amount, and settlement proof are public. Strategy context remained private.

### 4. Activity
Activity items should be able to distinguish:
- rule-only action
- Venice-assisted action

This lets Hashapp show that some actions were powered by private cognition while keeping the public ledger clean.

## Suggested v1 feature set
### Private Review
A user-controlled capability that allows an agent to use Venice before acting on:
- new vendors
- recurring charges
- unusual amounts
- requests outside normal behavior
- sensitive due diligence situations

This should live on the Agent page or a scoped policy surface, not as a whole-app mode switch.

## Payment / billing model
### v1 / hackathon recommendation
**Hashapp pays** for Venice usage.

Why:
- lower demo friction
- better UX
- simpler judging story
- avoids forcing users to bring a Venice key during first-run

### Later
Support:
- BYO Venice key
- premium / advanced reasoning tiers
- per-agent provider choice

## Track alignment
### Base Track 1 — Agents that pay
Venice helps explain and justify payment decisions using private context while Hashapp handles the public payment and proof.

### Base Track 2 — Agents that trust
Venice can power private due diligence and trust scoring before Hashapp stores or later attests to trust signals.

### Base Track 3 — Agents that cooperate
Venice can power private negotiation and deal reasoning while Hashapp handles public commitments and execution.

### Base Track 4 — Agents that keep secrets
This is the strongest fit.
Hashapp becomes the human-controlled disclosure layer that decides what becomes public after private reasoning occurs.

## Venice track fit
Hashapp + Venice is strongest when described as:
- private agent reasoning over sensitive context
- followed by trustworthy public action onchain
- with explicit human control over disclosure

That is more compelling than "a spending app with an AI toggle."

## Product rule
Do not let Venice take over the whole product story.
Hashapp remains the product.
Venice is the private intelligence layer inside it.

## Strongest one-line framing
**Hashapp lets humans control what agents can spend, while Venice lets those agents reason privately before acting publicly.**
