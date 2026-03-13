import React, { useState } from 'react';
import { useDemo } from '@/context/DemoContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Info } from 'lucide-react';

export default function Rules() {
  const { rules, toggleRule } = useDemo();
  const [toast, setToast] = useState<string | null>(null);

  const handleToggle = (id: string, name: string, willBeEnabled: boolean) => {
    toggleRule(id);
    setToast(`Rule "${name}" ${willBeEnabled ? 'enabled' : 'disabled'}`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 sticky top-0 bg-background/90 backdrop-blur-md z-10 border-b border-border/30">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Rules</h1>
        <p className="text-muted-foreground text-sm flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary" />
          Active spending constraints for Scout
        </p>
      </header>

      {/* Info Banner */}
      <div className="px-6 py-6">
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex gap-3">
          <Info className="text-primary shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-primary/90 leading-relaxed">
            Scout operates autonomously within these boundaries. Any purchase violating these rules requires human approval or is blocked automatically.
          </p>
        </div>
      </div>

      {/* Rules List */}
      <div className="px-6 flex flex-col gap-4">
        {rules.map((rule) => (
          <div 
            key={rule.id}
            className="bg-card border border-border/50 rounded-2xl p-5 flex items-center justify-between gap-4 transition-colors hover:border-border"
          >
            <span className={`text-[15px] font-medium leading-snug transition-colors ${rule.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
              {rule.name}
            </span>
            
            {/* Custom iOS-style Switch */}
            <button
              data-testid={`toggle-rule-${rule.id}`}
              onClick={() => handleToggle(rule.id, rule.name, !rule.enabled)}
              className={`
                relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent 
                transition-colors duration-200 ease-in-out focus:outline-none
                ${rule.enabled ? 'bg-emerald-500' : 'bg-secondary'}
              `}
            >
              <span className="sr-only">Toggle rule</span>
              <span
                className={`
                  pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 
                  transition duration-200 ease-in-out
                  ${rule.enabled ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-28 left-1/2 w-max max-w-[90%] bg-zinc-800 text-white text-sm font-medium px-4 py-3 rounded-full shadow-2xl border border-zinc-700 z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
