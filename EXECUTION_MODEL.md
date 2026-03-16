# EXECUTION_MODEL

## Rejected / dead rail
Coinbase SpendPermissionManager on plain EOA.

### Why rejected
Observed live on Base Sepolia:
- `approve()` tx can succeed
- `isApproved()` can still be false
- later `spend()` can revert

This is not the rail we are pursuing for the winning path.

## Active rail
MetaMask Smart Accounts Kit + ERC-7715 Advanced Permissions + ERC-7710 delegated redemption.

## Hashapp mapping
- user wallet = source of authority
- agent identity = app-level identity (Scout / BAiSED / custom agent)
- delegate/session account = technical executor under the hood
- grant permission = ERC-7715 permission request
- spend = delegated redemption tx
- receipt = tx proof + chain readback

## Product rule
Do not confuse agent identity with delegate/session account.
App identity comes first. Execution account is an implementation detail.

## Current principle
Keep the product shell. Replace the authority rail.
