import React from 'react';
import { Bot, Shield, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useDemo } from '@/context/DemoContext';
import { AvatarIcon } from '@/components/ui/AvatarIcon';

export default function Agent() {
  const { rules } = useDemo();
  const activeRulesCount = rules.filter(r => r.enabled).length;

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Profile Header */}
      <div className="px-6 pt-16 pb-8 flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border-2 border-zinc-700 flex items-center justify-center shadow-2xl">
            <Bot size={48} className="text-zinc-300" strokeWidth={1.5} />
          </div>
          <div className="absolute bottom-0 right-0 bg-background rounded-full p-1">
            <div className="w-5 h-5 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center">
              <CheckCircle2 size={12} className="text-white" strokeWidth={3} />
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-2">Scout</h1>
        <p className="text-muted-foreground text-sm mb-4">Research agent · reads markets, files reports</p>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-xs font-medium text-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active · verified
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 flex flex-col gap-4">
        
        <div className="bg-card rounded-2xl p-5 border border-border/50">
          <div className="flex items-center gap-3 mb-4 text-muted-foreground">
            <Zap size={18} />
            <span className="text-sm font-medium">Monthly Spend</span>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="text-4xl font-bold tracking-tighter text-foreground">$312.00</h2>
            <span className="text-sm text-muted-foreground mb-1.5">14 purchases</span>
          </div>
          <div className="w-full h-1.5 bg-secondary rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-primary w-[45%] rounded-full" />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-right">45% of $700 limit</p>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border/50 flex items-center justify-between cursor-pointer hover:bg-secondary/30 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Active Constraints</h3>
              <p className="text-sm text-muted-foreground">{activeRulesCount} rules applied</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-muted-foreground" />
        </div>

      </div>

      {/* Proof Footer */}
      <div className="mt-auto pt-12 text-center pb-4">
        <p className="text-[13px] text-muted-foreground/50 font-medium">
          Verified on Base · ERC-8004 #4721
        </p>
      </div>
    </div>
  );
}
