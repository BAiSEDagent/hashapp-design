# RUNTIME_STATUS

## Proven
- fallback shell builds and runs
- wallet balance read works
- receipt chain readback works
- old server-side spend executor wiring reaches chain (though old rail is no longer canonical)
- MetaMask delegation code path is wired in Replit branch
- Scout session key loads correctly server-side
- `/api/delegation/spend` reaches chain with a dummy permissionsContext

## Wired but not yet proven live
- `requestExecutionPermissions(...)` in MetaMask Flask
- storage of `permissionsContext` + `delegationManager`
- one real delegated spend redemption from the product UI
- live tx proof in Activity/Receipt for the MetaMask rail

## Required runtime env
- `VITE_USE_METAMASK_DELEGATION=true`
- `VITE_SCOUT_SESSION_ADDRESS=<public session account>`
- `SCOUT_SESSION_PRIVATE_KEY=<matching private key on server>`
- MetaMask Flask 13.5.0+ in a real browser
- Base Sepolia network active
- user wallet funded with ETH + test USDC
- Scout session account funded with ETH for gas (unless paymaster path replaces this later)

## Most likely failure points
- MetaMask Flask not installed / wrong version
- ERC-7702 smart-account upgrade not completed
- permissions grant not returning signer metadata
- counterfactual / undeployed smart account edge
- bad delegation manager address / version mismatch
- invalid permissionsContext

## Immediate proof target
One real loop:
1. grant delegated permission
2. redeem delegated spend
3. tx appears in Activity
4. Receipt shows tx + block/timestamp + BaseScan link
