# CURRENT_TRUTH

## Product
Hashapp is the spending app for AI agents.

## Product truth
- BYOA remains the product model
- user wallet stays in control
- agent gets bounded delegated authority
- Hashapp is the control / proof / receipt layer

## Canonical branches
- fallback shell: `integration/truth-pass-clean`
- active MetaMask pivot: `integration/metamask-delegation-poc`
- donor/raw branch only: `frontend/truth-pass`

## Active execution rail
MetaMask Smart Accounts Kit + ERC-7715 Advanced Permissions + ERC-7710 delegated redemption on Base Sepolia.

## What is real today
- truthful UI shell
- real wallet balance read
- receipts with chain readback
- agent identity / avatar / truth badges
- MetaMask delegation code path wired in Replit branch

## What is not yet proven live
- one real MetaMask/Flask permission grant
- one real delegated spend redemption in product
- end-to-end tx proof inside the live app using the delegation rail

## Current blocker
Browser-side MetaMask Flask grant step must be completed in a real browser.

## Single next move
Run one live delegated loop:
1. grant permission in Flask
2. redeem one spend
3. verify Activity + Receipt proof
