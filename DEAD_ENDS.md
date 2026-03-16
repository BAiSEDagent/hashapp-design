# DEAD_ENDS

## 2026-03-15 — Plain EOA + Coinbase SpendPermissionManager direct path
### What we tried
Use a plain EOA-driven flow with Coinbase SpendPermissionManager:
- grant via `approve()`
- verify with `isApproved()`
- spend via `spend()`

### What happened
- approve tx succeeded
- `isApproved()` still returned false
- spend reverted

### Why this matters
This path is not reliable enough for the winning product rail.

### Replacement
Use MetaMask Smart Accounts Kit + ERC-7715 + ERC-7710.

### Rule
Do not keep trying to salvage the plain-EOA Coinbase rail unless genuinely new evidence appears.
