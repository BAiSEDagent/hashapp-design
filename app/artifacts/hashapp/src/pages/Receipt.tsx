import { useRoute, Link } from 'wouter';
import { X, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTransactionReceipt, useBlock } from 'wagmi';
import { useDemo } from '@/context/DemoContext';
import { AvatarIcon } from '@/components/ui/AvatarIcon';

export default function Receipt() {
  const [, params] = useRoute('/receipt/:id');
  const { feed } = useDemo();
  
  const item = feed.find(f => f.id === params?.id);

  if (!item) return <div className="p-8 text-center mt-20 text-muted-foreground">Receipt not found</div>;

  const isBlocked = item.status === 'BLOCKED' || item.status === 'DECLINED';
  const hasRealProof = item.isReal && item.txHash;

  const { data: txReceipt } = useTransactionReceipt({
    hash: item.txHash as `0x${string}` | undefined,
    chainId: 84532,
    query: { enabled: !!item.txHash },
  });

  const { data: block } = useBlock({
    blockNumber: txReceipt?.blockNumber,
    chainId: 84532,
    query: { enabled: !!txReceipt?.blockNumber },
  });

  const confirmedAt = block?.timestamp
    ? new Date(Number(block.timestamp) * 1000).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: "spring", damping: 28, stiffness: 220 }}
      className="fixed inset-0 z-[100] flex justify-center bg-background"
    >
      <div className="w-full max-w-[430px] bg-background h-full flex flex-col relative">
        <div className="flex items-center justify-between p-6">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors">
            <X size={20} className="text-foreground/80" />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-12 flex flex-col items-center">
          <AvatarIcon 
            initial={item.merchantInitial} 
            colorClass={item.merchantColor} 
            size="xl" 
            className="mb-4 shadow-2xl"
          />
          
          <h2 className="text-[16px] font-medium text-muted-foreground/60 mb-3">{item.merchant}</h2>
          <h1 className="text-[48px] font-bold tracking-tighter text-foreground leading-none mb-5">
            {item.amountStr}
          </h1>

          <div className={`px-4 py-1.5 rounded-full text-[12px] font-medium mb-10 flex items-center gap-2
            ${isBlocked ? 'bg-rose-500/8 text-rose-400/80 border border-rose-500/10' : 
              item.status === 'PENDING' ? 'bg-amber-500/8 text-amber-400/80 border border-amber-500/10' : 
              'bg-emerald-500/8 text-emerald-400/80 border border-emerald-500/10'}
          `}>
            <div className={`w-[5px] h-[5px] rounded-full 
              ${isBlocked ? 'bg-rose-400' : 
                item.status === 'PENDING' ? 'bg-amber-400' : 
                'bg-emerald-400'}
            `} />
            {item.statusMessage}
          </div>

          <div className="w-full bg-card rounded-2xl p-5 border border-border/30 space-y-0">
            <DetailRow label="Date & Time" value={`${item.dateGroup === 'TODAY' ? 'Today' : item.dateGroup === 'YESTERDAY' ? 'Yesterday' : item.dateGroup} at ${item.timestamp}`} />
            <DetailRow label="Category" value={item.category} />
            <div className="flex flex-col gap-1.5 py-4 border-t border-white/[0.05]">
              <span className="text-[11px] text-muted-foreground/40 font-medium">Stated Purpose</span>
              <span className="text-[12px] text-foreground/90 font-medium leading-relaxed">{item.intent}</span>
            </div>
            <DetailRow 
              label="Approval" 
              value={item.status === 'AUTO_APPROVED' ? 'Auto-approved' : item.status === 'APPROVED' ? 'Human-approved' : item.status === 'BLOCKED' ? 'Blocked by rule' : item.status === 'DECLINED' ? 'Declined' : 'Pending'} 
            />
            {hasRealProof && txReceipt?.blockNumber && (
              <>
                <DetailRow label="Network" value="Base Sepolia" />
                <DetailRow label="Block" value={txReceipt.blockNumber.toString()} />
                {confirmedAt && <DetailRow label="Confirmed" value={confirmedAt} />}
                <DetailRow label="Transaction" value={`${item.txHash!.slice(0, 10)}...${item.txHash!.slice(-8)}`} />
              </>
            )}
            <div className="flex items-center justify-between py-4 border-t border-white/[0.05]">
              <span className="text-[11px] text-muted-foreground/40 font-medium">
                {isBlocked ? 'Requested by' : 'Authorized by'}
              </span>
              <div className="flex items-center gap-2">
                <AvatarIcon initial="S" colorClass="bg-zinc-800" size="sm" />
                <div className="text-right">
                  <span className="text-[12px] font-medium block">Scout</span>
                  <span className="text-[9px] text-muted-foreground/30 font-mono tracking-wide">scout.base.eth</span>
                </div>
              </div>
            </div>
          </div>

          {hasRealProof && (
            <div className="mt-8 text-center space-y-2">
              <p className="text-[11px] text-emerald-400/50 flex items-center justify-center gap-1.5 tracking-wide">
                Settled on Base Sepolia · onchain proof
              </p>
              <a 
                href={`https://sepolia.basescan.org/tx/${item.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono text-muted-foreground/30 flex items-center justify-center gap-1 cursor-pointer hover:text-muted-foreground/50 transition-colors"
              >
                tx {item.txHash!.slice(0, 6)}...{item.txHash!.slice(-4)} <ExternalLink size={8} />
              </a>
            </div>
          )}

          {!hasRealProof && (item.status === 'APPROVED' || item.status === 'AUTO_APPROVED') && (
            <div className="mt-8 text-center">
              <p className="text-[10px] text-muted-foreground/20 tracking-wide">
                Demo transaction · no onchain proof
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-t border-white/[0.05] first:border-t-0 first:pt-0">
      <span className="text-[11px] text-muted-foreground/40 font-medium">{label}</span>
      <span className="text-[12px] text-foreground/90 font-medium text-right">{value}</span>
    </div>
  );
}
