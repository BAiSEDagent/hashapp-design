import { ExternalLink } from 'lucide-react';

type BadgeType = 'onchain' | 'demo' | 'pending' | 'delegation' | 'expired';

const BADGE_CONFIG = {
  onchain: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/15',
    text: 'text-emerald-400/80',
    dot: 'bg-emerald-400',
    label: 'Onchain',
    caveat: null,
  },
  delegation: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/15',
    text: 'text-orange-400/80',
    dot: 'bg-orange-400',
    label: 'Delegation',
    caveat: 'Status unverified — may be revoked onchain',
  },
  expired: {
    bg: 'bg-zinc-500/8',
    border: 'border-rose-500/15',
    text: 'text-rose-400/60',
    dot: 'bg-rose-400/50',
    label: 'Expired',
    caveat: 'Delegation has expired',
  },
  demo: {
    bg: 'bg-zinc-500/8',
    border: 'border-zinc-500/10',
    text: 'text-zinc-400/60',
    dot: 'bg-zinc-500/50',
    label: 'Demo',
    caveat: null,
  },
  pending: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/15',
    text: 'text-amber-400/80',
    dot: 'bg-amber-400',
    label: 'Pending',
    caveat: null,
  },
} as const;

export function TruthBadge({
  type,
  txHash,
  expiresAt,
  showCaveat = false,
}: {
  type: BadgeType;
  txHash?: string;
  expiresAt?: number;
  showCaveat?: boolean;
}) {
  const now = Math.floor(Date.now() / 1000);
  const isExpired = type === 'delegation' && expiresAt && expiresAt <= now;
  const effectiveType = isExpired ? 'expired' : type;
  const c = BADGE_CONFIG[effectiveType];

  const badge = (effectiveType === 'onchain' || effectiveType === 'delegation') && txHash ? (
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
  ) : (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ${c.bg} border ${c.border} ${c.text} text-[9px] font-semibold uppercase tracking-[0.06em]`}>
      <div className={`w-[4px] h-[4px] rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );

  if (showCaveat && c.caveat) {
    return (
      <div className="flex flex-col gap-0.5">
        {badge}
        <span className={`text-[8px] ${c.text} opacity-70`}>{c.caveat}</span>
      </div>
    );
  }

  return badge;
}
