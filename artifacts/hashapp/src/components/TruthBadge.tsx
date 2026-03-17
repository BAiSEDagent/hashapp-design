import { ExternalLink } from 'lucide-react';

type BadgeType = 'onchain' | 'demo' | 'pending' | 'delegation' | 'expired';

const BADGE_CONFIG = {
  onchain: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/15',
    text: 'text-emerald-400/80',
    dot: 'bg-emerald-400',
    label: 'Onchain',
  },
  delegation: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/15',
    text: 'text-orange-400/80',
    dot: 'bg-orange-400',
    label: 'Delegation',
  },
  expired: {
    bg: 'bg-zinc-500/8',
    border: 'border-rose-500/15',
    text: 'text-rose-400/60',
    dot: 'bg-rose-400/50',
    label: 'Expired',
  },
  demo: {
    bg: 'bg-zinc-500/8',
    border: 'border-zinc-500/10',
    text: 'text-zinc-400/60',
    dot: 'bg-zinc-500/50',
    label: 'Demo',
  },
  pending: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/15',
    text: 'text-amber-400/80',
    dot: 'bg-amber-400',
    label: 'Pending',
  },
} as const;

export function TruthBadge({
  type,
  txHash,
  expiresAt,
}: {
  type: BadgeType;
  txHash?: string;
  expiresAt?: number;
}) {
  const now = Math.floor(Date.now() / 1000);
  const isExpired = type === 'delegation' && expiresAt && expiresAt <= now;
  const effectiveType = isExpired ? 'expired' : type;
  const c = BADGE_CONFIG[effectiveType];

  if ((effectiveType === 'onchain' || effectiveType === 'delegation') && txHash) {
    return (
      <a
        href={`https://sepolia.basescan.org/tx/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ${c.bg} border ${c.border} ${c.text} text-[9px] font-semibold uppercase tracking-[0.06em] hover:opacity-80 transition-opacity`}
      >
        <div className={`w-[4px] h-[4px] rounded-full ${c.dot}`} />
        {c.label}
        <ExternalLink size={7} />
      </a>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ${c.bg} border ${c.border} ${c.text} text-[9px] font-semibold uppercase tracking-[0.06em]`}>
      <div className={`w-[4px] h-[4px] rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
