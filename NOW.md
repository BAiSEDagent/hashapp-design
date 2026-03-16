# NOW

## Current task
Prove one live MetaMask delegated spend loop in Hashapp.

## Owners
- Adam: real-browser MetaMask Flask grant step
- Replit: deployed runtime / env / exact failure capture
- BAiSED: repo truth, branch hygiene, targeted fixes, clean port into pivot branch after proof

## Done means
All are true:
1. MetaMask Flask grants ERC-7715 permission
2. Scout session account redeems one spend
3. Activity shows the real delegated spend
4. Receipt shows tx hash, BaseScan link, block/timestamp

## Blocked by
The browser-side MetaMask Flask permission grant has not yet been completed successfully.

## Do not do
- no new redesign work
- no new branch sprawl
- no re-litigation of the old Coinbase EOA rail
- no broadening scope before the delegated loop is proven
