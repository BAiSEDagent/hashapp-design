---
name: hashapp-build-brief
description: Build brief for Replit Agent / fast implementation agents creating the first Hashapp prototype.
---

# Hashapp — Replit Build Brief

## What this is
Hashapp is a **consumer-grade spending app for AI agents**.

It is not a generic crypto wallet dashboard.
It is not an infra admin panel.
It is not a terminal UI.
It is not a blockchain explorer.

Hashapp should feel like a premium mobile finance app where a human can safely let an AI agent buy what it needs.

## Product thesis
People can let agents spend money, but they still lack a simple, beautiful way to:
- set boundaries
- approve or auto-approve purchases
- inspect receipts
- understand what the agent bought and why
- revoke access instantly

## Core demo lane
Use a **research agent**.

Named agent: **Scout**

The product should revolve around a research agent buying research credits / API access / tooling within a defined budget and rule set.

## Hero of the product
The hero is the **activity feed**.

The feed is the product.
Not the settings screen.
Not the wallet connection.
Not the architecture.

The feed must make trust visible.

## 90-second demo flow
1. Open directly on the **Activity** screen.
2. Show recent purchases from Scout.
3. New purchase request appears live.
4. User approves it.
5. Receipt lands in the feed.
6. User changes one plain-English rule.
7. Scout tries another request.
8. It gets blocked.
9. Blocked state appears in feed with a clear reason.

## Required screens
Build these first:

### 1. Activity
Must include:
- agent avatar + name
- service/vendor
- amount
- one-line reason
- matched rule or blocked reason
- status chip
- timestamp

### 2. Receipt Detail
Must include:
- vendor
- amount
- status
- agent
- reason
- matched or violated rule
- tx/proof section

### 3. Approval Request
Must include:
- agent
- amount
- service/vendor
- one-line rationale
- approve / deny / always allow

### 4. Rules
Must use plain English rules.
Examples:
- Up to $20/day on research tools
- Always ask above $5
- Never buy from unknown vendors
- Trusted vendors can auto-renew within budget

### 5. Agent Detail
Must include:
- agent identity
- avatar
- budget
- preset/persona
- trusted payees
- pause / revoke

### 6. Payees
Must include:
- search by ENS, Basename, address, or name
- trusted payees
- verified services
- avatar-first identity

## UX principles
- dark mode first
- mobile-first
- Cash App-inspired clarity
- soft cards, clean hierarchy, strong spacing
- premium consumer feel
- normal money app for abnormal agent behavior
- human-readable everything

## Approval / escalation model
### Intra-session
- silent
- no prompt
- receipt appears after action

### Policy shift
- quick prompt
- lightweight confirmation

### Out-of-bounds
- full re-auth feel
- clear explanation

## Product language
Use plain English.
Avoid protocol jargon in the UI.

Prefer:
- Approved
- Blocked
- New vendor needs confirmation
- Payee identity mismatch
- Within research budget

Avoid:
- Execution reverted
- Policy hook rejected
- Session invalidation
- Raw transaction/admin language

## Feed style guidance
The feed should be **intent-aware**, not tx-aware.

Good:
- Scout bought research credits for today’s market scan.
- Approved — within research budget.
- Blocked — exceeds daily research limit.

Bad:
- Sent 0.01 ETH to 0x123...
- Contract interaction completed.

## Design anti-patterns
Do NOT build:
- a cyber dashboard
- a terminal aesthetic
- an analytics-heavy control panel
- giant protocol diagrams in the UI
- raw hex-first identity
- multiple competing primary buttons
- generic “wallet manager” flows

## Build constraints
- prioritize believable product behavior over real protocol completeness
- the prototype can mock some backend/business logic if needed
- the app should look and feel real even if some onchain pieces are stubbed in v1
- center the activity feed, approval moment, and blocked moment

## What success looks like
A judge should see Hashapp for 30 seconds and immediately understand:
- this is the spending app for AI agents
- this makes agent purchases feel safe
- this is consumer-grade, not crypto tooling
- this product should exist

## Supporting docs
Use these docs in the repo for deeper guidance:
- `README.md`
- `PRODUCT.md`
- `ARCHITECTURE.md`
- `UX.md`
- `POLICY_MODEL.md`
- `FLOWS.md`
- `DATA_MODEL.md`
- `REVIEWS.md`
- `DEMO_SCENARIO.md`
- `STRATEGY.md`
