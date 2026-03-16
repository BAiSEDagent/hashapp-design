# MetaMask Delegation Migration — Hashapp

## Goal
Replace the current Coinbase SpendPermissionManager execution rail with the MetaMask Smart Accounts Kit + Delegation Framework path, while keeping the current Hashapp product shell intact.

## Why we are doing this
The current plain-EOA + `SpendPermissionManager.approve()` path does not produce a valid spendable permission in the app flow.

Observed on Base Sepolia:
- `approve()` tx can succeed
- `isApproved()` can still be false
- later `spend()` reverts

This is a product-blocking mismatch for the current execution rail.

## Keep
Do NOT redesign these:
- Money
- Activity
- Scout / linked agent identity
- truth badges
- receipts
- avatar / identity work
- non-custodial language

These are already the right product shell.

## Replace
Replace only the authority / execution rail:
- Coinbase SpendPermissionManager
- current Grant Permission plumbing
- current Scout spend executor assumptions

With:
- MetaMask Smart Accounts Kit
- ERC-7715 Advanced Permissions
- ERC-7710 delegation redemption
- Scout as session account / delegate

## Winning product loop
1. user connects MetaMask
2. user upgrades / uses smart-account-capable path
3. app requests periodic USDC permission for Scout
4. user grants permission via MetaMask UI
5. Scout session account redeems one spend on Base Sepolia
6. Activity and Receipt show real tx proof
7. user can revoke / let permission expire

## Target implementation
### Phase 1 — proof lane only
Build one complete delegated spend loop.

### Stack
- `@metamask/smart-accounts-kit@0.3.0`
- MetaMask Flask / supported wallet with ERC-7715 support
- Base Sepolia
- session account for Scout
- periodic ERC-20 permission request

### Permission type
Use first:
- `erc20-token-periodic`

Why:
This maps directly to Hashapp's core UX:
- X USDC per period
- human-readable grant
- recurring bounded spending

## Proposed architecture
### User wallet
- MetaMask wallet
- smart-account-capable path (prefer 7702 / supported upgrade flow)

### Scout
- isolated session account
- holds no user funds
- receives delegated authority only

### Grant Permission flow
Replace current onchain permission issue flow with:
- `requestExecutionPermissions([...])`
- signer = Scout session account address
- permission = `erc20-token-periodic`
- chain = Base Sepolia
- expiry = short demo-safe window
- `isAdjustmentAllowed = true`

### Spend flow
Scout redeems via:
- `sendTransactionWithDelegation(...)` if Scout is EOA session account
- or `sendUserOperationWithDelegation(...)` if Scout is smart-account session path

First proof should prefer the simpler path that works fastest.

### Receipt / Activity
Use the delegated redemption tx as the source of truth.
- Activity gets real spend event
- Receipt reads tx / block / timestamp
- explorer link points to BaseScan

## Hashapp file areas likely to change
### Frontend
- `app/artifacts/hashapp/src/config/wallet.ts`
- `app/artifacts/hashapp/src/pages/Activity.tsx`
- `app/artifacts/hashapp/src/pages/Money.tsx`
- `app/artifacts/hashapp/src/pages/Receipt.tsx`
- `app/artifacts/hashapp/src/context/DemoContext.tsx`

### New likely helpers
- `app/artifacts/hashapp/src/lib/metamaskPermissions.ts`
- `app/artifacts/hashapp/src/lib/sessionAccount.ts`
- `app/artifacts/hashapp/src/lib/delegationSpend.ts`

### Backend / runtime
Only if needed for session-account execution or storing permission contexts.
Do not add unnecessary backend complexity in phase 1.

## What to remove or gate
Do not fully delete yet. Instead feature-gate off the old path:
- current SpendPermissionManager grant path
- current `/api/test/spend` path if it becomes obsolete

Use a clear flag while migrating:
- `VITE_USE_METAMASK_DELEGATION=true`

## Acceptance criteria for phase 1
A build is acceptable only if all are true:
- user connects MetaMask
- user grants periodic USDC permission to Scout via MetaMask permission UI
- Scout executes one real delegated spend on Base Sepolia
- Activity shows that spend
- Receipt shows tx hash + block/timestamp + BaseScan link
- user control story remains clear and non-custodial
- no fake proof language

## Phase 2 (only after phase 1 works)
- richer caveats
- better revocation UI
- delegated history / indexing
- stronger Track 1 conditional execution story
- MetaMask track embellishments only after real loop exists

## Explicit non-goals for phase 1
- no redesign spiral
- no fancy caveat enforcers yet
- no custom ZK path yet
- no subdelegation experiments yet
- no generic wallet abstraction rewrite

## Judge-facing product line
Hashapp lets a user keep control of their wallet, grant Scout bounded delegation-based spending authority through MetaMask, and verify every agent payment onchain with real receipt proof.
