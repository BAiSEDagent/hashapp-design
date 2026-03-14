# Permission Plumbing Decision

## The question
Should Hashapp:

1. stay Base-first all the way down and build the delegated-permission / spend-permission tooling ourselves on top of Base smart wallet infrastructure, or
2. use MetaMask’s Delegation Toolkit / Smart Accounts permissions model as the main permission plumbing while keeping Base as the primary chain/product home?

## Option A — Base-first, build the permission layer ourselves

### What it means
- Base remains both the product home and the primary wallet/plumbing stack
- Hashapp implements the permission product layer on top of Base smart wallet/account infrastructure
- We build the user-facing spend permission model ourselves

### Why it’s attractive
- strongest product coherence
- strongest Base-native story
- most impressive if it works cleanly
- best alignment with Base track and overall app identity
- we own the permission experience instead of adapting to another wallet’s vocabulary

### Risks
- more engineering work
- more hidden infrastructure complexity
- higher chance of spending time on plumbing instead of shipping polish and demo clarity
- could lead to “we built our own wallet logic” complexity if not carefully constrained

### Best reason to choose it
If we believe we can ship a clean, convincing delegated-permission layer on top of Base in time, this is the most differentiated and impressive version.

## Option B — Base-first product, MetaMask permission plumbing

### What it means
- Base remains the home chain, settlement layer, and product narrative
- MetaMask powers or inspires the delegated-permission implementation path
- Hashapp uses the more packaged delegated-action model instead of building as much from scratch

### Why it’s attractive
- potentially less custom plumbing work
- MetaMask docs/tooling appear more explicit around advanced permissions, automation, and delegated actions
- may improve partner / prize eligibility
- can still keep the product Base-native at the story level

### Risks
- easier to confuse the product story if not framed carefully
- could weaken the “this is a Base-native spending app” clarity if overemphasized
- may make the architecture feel less owned if the permission model is obviously borrowed wholesale

### Best reason to choose it
If speed and implementation certainty matter more than owning the whole permission stack, MetaMask may be the cleaner path.

## Honest read right now
### Base
- strongest home chain and product identity
- strongest settlement story
- strongest ecosystem fit
- less clearly packaged delegated-permission toolkit from the docs we reviewed

### MetaMask
- stronger apparent delegated-permission toolkit
- clearer advanced-permission / automation framing
- more explicit support for the exact user-granted agent action model Hashapp wants

## Current recommendation
### Product story
Keep Hashapp **Base-first**.

### Technical decision
Do not decide emotionally. Compare the permission layer by:
1. implementation speed
2. recurring spend support
3. delegated permission clarity
4. fit with current prototype
5. prize / partner upside

## Bias
If Base can support the required permission model cleanly enough in time, choose Base-first all the way down.

If MetaMask materially reduces work and makes the permission system more real, use it — but keep the product narrative singular:
- Hashapp settles on Base
- Hashapp is a spending app for AI agents
- delegated permissions are the implementation mechanism, not the product itself

## Rule
Do not become a multi-wallet showcase. The user-facing story must remain one coherent system.
