# Hashapp App Workspace

This folder contains the cleaned integration of the Replit truth-pass app/workspace.

## What lives here
- `artifacts/hashapp` — the frontend app
- `artifacts/api-server` — minimal API scaffold
- `lib/*` — shared workspace libraries carried over from the Replit export
- `scripts` — utility scripts from the export

## Why this is nested under `app/`
The repo root already contains the product docs, proof notes, strategy docs, and decision logs.
Keeping the runtime under `app/` lets us preserve the docs as source-of-truth while still bringing the app into the same repository.

## Current status
This is the **truth-pass** version of the app:
- fake tx hashes removed
- proof links only appear when a real tx hash exists
- wallet connection surface added (wagmi + Base Sepolia)
- local demo state persists across refresh
- dead CTAs reduced / removed
- many flows are still simulated and must remain honestly labeled

## Run the frontend
From repo root:

```bash
cd app
pnpm install
pnpm --filter @workspace/hashapp run dev
```

## Run the full workspace typecheck
From `app/`:

```bash
pnpm install
pnpm run typecheck
```

## Notes
- This is a cleaned extraction from the Replit `frontend/truth-pass` branch.
- Replit-specific junk (`.agents`, archives, mockup sandbox, artifact metadata`) was intentionally excluded here.
- The next engineering step is to connect one real permission path from the separate Base-native proof into the app honestly.
