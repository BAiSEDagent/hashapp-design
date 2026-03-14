import React, { useState } from 'react';
import { useDemo } from '@/context/DemoContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Info } from 'lucide-react';

export default function Rules() {
  const { rules, toggleRule } = useDemo();
  const [toast, setToast] = useState<string | null>(null);

  const activeCount = rules.filter(r => r.enabled).length;

  const handleToggle = (id: string, name: string, willBeEnabled: boolean) => {
    toggleRule(id);
    setToast(`${name} ${willBeEnabled ? 'enabled' : 'disabled'}`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex flex-col min-h-full pb-8">
      <header className="px-6 pt-12 pb-5 sticky top-0 bg-background/90 backdrop-blur-md z-10">
        <div className="flex items-center justify-between mb-1.5">
          <h1 className="text-3xl font-bold tracking-tight">Rules</h1>
          <div className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/15">
            <span className="text-[11px] font-semibold text-primary tabular-nums">{activeCount} active</span>
          </div>
        </div>
        <p className="text-[13px] text-muted-foreground/60 flex items-center gap-2">
          <ShieldCheck size={14} className="text-primary/70" />
          Spending constraints for Scout
        </p>
      </header>

      <div className="px-6 pb-4">
        <div className="bg-primary/[0.06] border border-primary/10 rounded-xl p-4 flex gap-3">
          <Info className="text-primary/60 shrink-0 mt-0.5" size={16} />
          <p className="text-[12px] text-primary/60 leading-relaxed">
            Scout operates autonomously within these boundaries. Purchases that violate active rules require your approval or are blocked automatically.
          </p>
        </div>
      </div>

      <div className="px-6 flex flex-col gap-3 mt-1">
        {rules.map((rule, i) => (
          <motion.div 
            key={rule.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className={`
              bg-card rounded-2xl p-5 border transition-all duration-300
              ${rule.enabled 
                ? 'border-border/50 hover:border-border/80' 
                : 'border-border/20 opacity-60'
              }
            `}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className={`text-[15px] font-semibold leading-snug mb-1 transition-colors ${rule.enabled ? 'text-foreground' : 'text-muted-foreground/70'}`}>
                  {rule.name}
                </h3>
                <p className="text-[11px] text-muted-foreground/50 leading-relaxed">{rule.description}</p>
              </div>
              
              <button
                data-testid={`toggle-rule-${rule.id}`}
                onClick={() => handleToggle(rule.id, rule.name, !rule.enabled)}
                className={`
                  relative inline-flex h-[26px] w-[46px] shrink-0 cursor-pointer items-center rounded-full 
                  transition-all duration-300 ease-out focus:outline-none mt-0.5
                  ${rule.enabled 
                    ? 'bg-emerald-500 shadow-[0_0_12px_-2px_rgba(52,211,153,0.3)]' 
                    : 'bg-zinc-700/60'
                  }
                `}
              >
                <span className="sr-only">Toggle rule</span>
                <span
                  className={`
                    pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-sm
                    transition-all duration-300 ease-out
                    ${rule.enabled ? 'translate-x-[22px]' : 'translate-x-[2px]'}
                  `}
                />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-auto pt-10 text-center pb-4">
        <p className="text-[12px] text-muted-foreground/30 font-medium tracking-wide">
          Rules enforced onchain via smart wallet
        </p>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-28 left-1/2 w-max max-w-[85%] bg-zinc-800/95 backdrop-blur-sm text-white text-[13px] font-medium px-5 py-3 rounded-full shadow-2xl border border-zinc-700/50 z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
