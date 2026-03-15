import React from 'react';
import { Wallet, Shield, ArrowRight } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useDemo, type SpendPermission } from '@/context/DemoContext';
import { AvatarIcon } from '@/components/ui/AvatarIcon';
import { useLocation } from 'wouter';

export default function Money() {
  const { feed, rules, spendPermissions } = useDemo();
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [, setLocation] = useLocation();

  const spent = feed
    .filter(i => i.status === 'APPROVED' || i.status === 'AUTO_APPROVED')
    .reduce((sum, i) => sum + i.amount, 0);

  const monthlyLimit = 700;
  const available = monthlyLimit - spent;
  const activeRulesCount = rules.filter(r => r.enabled).length;
  const activePermissions = spendPermissions.filter(p => p.state === 'active');
  const purchaseCount = feed.filter(i => i.status === 'APPROVED' || i.status === 'AUTO_APPROVED').length;

  const truncatedAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}` 
    : null;

  return (
    <div className="flex flex-col min-h-full pb-8">
      <header className="px-6 pt-12 pb-2">
        <h1 className="text-[28px] font-bold tracking-tight">Money</h1>
        <p className="text-[11px] text-muted-foreground/50 mt-0.5">Your wallet · Scout's allocation</p>
      </header>

      <div className="px-6 pt-5 flex flex-col gap-4">
        <div className="relative bg-card rounded-2xl p-6 border border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={13} className="text-muted-foreground/50" />
              <span className="text-[12px] text-muted-foreground/60 font-medium">Available for Scout</span>
            </div>
            <h2 className="text-[48px] font-bold tracking-tighter text-foreground leading-none mb-1.5">
              ${available.toFixed(2)}
            </h2>
            <p className="text-[12px] text-muted-foreground/40">
              USDC · remaining under active rules
            </p>

            <div className="w-full h-[3px] bg-white/[0.06] rounded-full mt-6 overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-700 ease-out" 
                style={{ width: `${Math.min((spent / monthlyLimit) * 100, 100)}%` }} 
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-muted-foreground/35">${spent.toFixed(2)} spent this month</span>
              <span className="text-[10px] text-muted-foreground/35">${monthlyLimit.toFixed(2)} allocated</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl p-4 border border-border/30">
            <span className="text-[10px] text-muted-foreground/45 font-medium uppercase tracking-wider">Allocated to Scout</span>
            <p className="text-[22px] font-bold tracking-tight mt-1">${monthlyLimit.toFixed(2)}</p>
            <p className="text-[10px] text-muted-foreground/30 mt-0.5">USDC · monthly budget</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border/30">
            <span className="text-[10px] text-muted-foreground/45 font-medium uppercase tracking-wider">Spent this month</span>
            <p className="text-[22px] font-bold tracking-tight mt-1">${spent.toFixed(2)}</p>
            <p className="text-[10px] text-muted-foreground/30 mt-0.5">{purchaseCount} purchases</p>
          </div>
        </div>

        {activePermissions.length > 0 && (
          <div className="flex flex-col gap-2 mt-1">
            <h3 className="text-[10px] font-semibold text-muted-foreground/35 uppercase tracking-[0.2em] pl-1">
              Active Spend Permissions
            </h3>
            {activePermissions.map(perm => (
              <SpendPermissionRow key={perm.id} permission={perm} />
            ))}
          </div>
        )}

        <div 
          onClick={() => setLocation('/rules')}
          className="bg-card rounded-2xl p-4 border border-border/30 flex items-center gap-4 cursor-pointer hover:bg-white/[0.02] active:bg-white/[0.04] transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
            <Shield size={16} className="text-primary/80" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-[13px]">Protected by {activeRulesCount} rules</h3>
            <p className="text-[10px] text-muted-foreground/40">Scout can only spend within your constraints</p>
          </div>
          <ArrowRight size={14} className="text-muted-foreground/25 shrink-0" />
        </div>

        <div className="bg-card rounded-2xl p-4 border border-border/30 mt-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Wallet size={13} className="text-blue-400/80" />
              </div>
              <div>
                <p className="text-[12px] font-medium text-foreground">
                  {isConnected ? 'Connected Wallet' : 'No Wallet Connected'}
                </p>
                {isConnected && truncatedAddress && (
                  <p className="text-[10px] text-muted-foreground/35 font-mono">
                    {truncatedAddress} · {chain?.name || 'Base Sepolia'}
                  </p>
                )}
              </div>
            </div>
            {isConnected ? (
              <button 
                onClick={() => disconnect()}
                className="text-[10px] text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors"
              >
                Disconnect
              </button>
            ) : null}
          </div>

          {isConnected ? (
            <p className="text-[10px] text-muted-foreground/35 leading-relaxed pl-10">
              Funds stay in your smart wallet. Scout operates through scoped permissions — Hashapp never takes custody.
            </p>
          ) : (
            <div className="pl-10">
              <p className="text-[10px] text-muted-foreground/35 leading-relaxed mb-3">
                Connect a wallet to enable real spend permissions on Base. Hashapp never takes custody of your funds.
              </p>
              <div className="flex flex-wrap gap-2">
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    className="text-[11px] font-medium text-primary/80 bg-primary/8 hover:bg-primary/12 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {connector.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto pt-8 text-center pb-4">
        <p className="text-[10px] text-muted-foreground/20 font-medium tracking-widest uppercase">
          Base Sepolia · Testnet
        </p>
      </div>
    </div>
  );
}

function SpendPermissionRow({ permission }: { permission: SpendPermission }) {
  const cadenceLabel = { daily: '/day', weekly: '/wk', monthly: '/mo' };
  return (
    <div className="flex items-center gap-3.5 p-3 rounded-xl bg-card border border-border/30 hover:border-border/50 transition-colors">
      <AvatarIcon initial={permission.vendorInitial} colorClass={permission.vendorColor} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-foreground">{permission.vendor}</span>
          <div className={`w-[5px] h-[5px] rounded-full ${permission.state === 'active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
        </div>
      </div>
      <div className="text-right shrink-0">
        <span className="text-[13px] font-semibold tabular-nums">${permission.amount}</span>
        <span className="text-[10px] text-muted-foreground/40">{cadenceLabel[permission.cadence]}</span>
      </div>
    </div>
  );
}
