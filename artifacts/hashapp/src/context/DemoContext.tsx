import React, { createContext, useContext, useState, useEffect } from 'react';

export type StatusType = 'APPROVED' | 'AUTO_APPROVED' | 'PENDING' | 'BLOCKED' | 'DECLINED';

export interface FeedItem {
  id: string;
  dateGroup: 'TODAY' | 'YESTERDAY' | 'MARCH 11';
  merchant: string;
  merchantColor: string;
  merchantInitial: string;
  amount: number;
  amountStr: string;
  intent: string;
  status: StatusType;
  statusMessage: string;
  timestamp: string;
  category: string;
  txHash?: string;
}

export interface Rule {
  id: string;
  name: string;
  enabled: boolean;
}

interface DemoState {
  feed: FeedItem[];
  rules: Rule[];
  stage: 'INITIAL' | 'PENDING_ADDED' | 'APPROVED' | 'RULE_DISABLED' | 'BLOCKED_ADDED';
  approvePending: (id: string) => void;
  declinePending: (id: string) => void;
  toggleRule: (id: string) => void;
}

const INITIAL_FEED: FeedItem[] = [
  {
    id: 'tx-2',
    dateGroup: 'TODAY',
    merchant: 'Perplexity',
    merchantColor: 'bg-teal-500',
    merchantInitial: 'P',
    amount: 20.00,
    amountStr: '$20.00',
    intent: "Scout bought research credits for today's market scan",
    status: 'AUTO_APPROVED',
    statusMessage: 'Auto-approved — within daily budget',
    timestamp: '11:42 AM',
    category: 'Research Tools',
    txHash: '0x8f2a...c912'
  },
  {
    id: 'tx-3',
    dateGroup: 'TODAY',
    merchant: 'CloudAnalytics',
    merchantColor: 'bg-rose-600',
    merchantInitial: 'C',
    amount: 299.00,
    amountStr: '$299.00',
    intent: "Scout tried to purchase enterprise analytics suite",
    status: 'BLOCKED',
    statusMessage: 'Blocked — exceeds research budget',
    timestamp: '9:15 AM',
    category: 'Software'
  },
  {
    id: 'tx-4',
    dateGroup: 'YESTERDAY',
    merchant: 'OpenAI',
    merchantColor: 'bg-zinc-700',
    merchantInitial: 'O',
    amount: 45.00,
    amountStr: '$45.00',
    intent: "Scout renewed API credits for report generation",
    status: 'APPROVED',
    statusMessage: 'Approved',
    timestamp: '4:20 PM',
    category: 'API Services',
    txHash: '0x4a2f...e91b'
  },
  {
    id: 'tx-5',
    dateGroup: 'YESTERDAY',
    merchant: 'PitchBook',
    merchantColor: 'bg-blue-600',
    merchantInitial: 'P',
    amount: 35.00,
    amountStr: '$35.00',
    intent: "Scout purchased market intelligence data",
    status: 'AUTO_APPROVED',
    statusMessage: 'Auto-approved',
    timestamp: '1:10 PM',
    category: 'Data Services',
    txHash: '0x1b9c...f44a'
  },
  {
    id: 'tx-6',
    dateGroup: 'MARCH 11',
    merchant: 'Statista',
    merchantColor: 'bg-orange-500',
    merchantInitial: 'S',
    amount: 29.00,
    amountStr: '$29.00',
    intent: "Scout bought industry report access",
    status: 'APPROVED',
    statusMessage: 'Approved',
    timestamp: '10:05 AM',
    category: 'Research Reports',
    txHash: '0x99dd...2a11'
  }
];

const INITIAL_RULES: Rule[] = [
  { id: 'r1', name: 'Only spend on verified research tools', enabled: true },
  { id: 'r2', name: 'Maximum $50 per single purchase', enabled: true },
  { id: 'r3', name: 'Daily spending limit: $200', enabled: true },
  { id: 'r4', name: 'No recurring charges', enabled: true },
  { id: 'r5', name: 'Require approval for new vendors', enabled: true },
];

const DemoContext = createContext<DemoState | undefined>(undefined);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [feed, setFeed] = useState<FeedItem[]>(INITIAL_FEED);
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [stage, setStage] = useState<DemoState['stage']>('INITIAL');

  // Trigger 1: Add pending request after 3s
  useEffect(() => {
    if (stage === 'INITIAL') {
      const timer = setTimeout(() => {
        const pendingTx: FeedItem = {
          id: 'tx-1-pending',
          dateGroup: 'TODAY',
          merchant: 'DataStream Pro',
          merchantColor: 'bg-purple-600',
          merchantInitial: 'D',
          amount: 89.00,
          amountStr: '$89.00',
          intent: "Scout wants to subscribe to DataStream Pro for real-time market data",
          status: 'PENDING',
          statusMessage: 'Needs approval',
          timestamp: 'Just now',
          category: 'Data Services'
        };
        setFeed(prev => [pendingTx, ...prev]);
        setStage('PENDING_ADDED');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Trigger 2: Add blocked request after rule disabled
  useEffect(() => {
    if (stage === 'RULE_DISABLED') {
      const timer = setTimeout(() => {
        const blockedTx: FeedItem = {
          id: 'tx-7-blocked',
          dateGroup: 'TODAY',
          merchant: 'DataStream Pro',
          merchantColor: 'bg-purple-600',
          merchantInitial: 'D',
          amount: 89.00,
          amountStr: '$89.00/mo',
          intent: "Scout attempted recurring subscription to DataStream Pro",
          status: 'BLOCKED',
          statusMessage: 'Blocked — recurring charges disabled',
          timestamp: 'Just now',
          category: 'Data Services'
        };
        setFeed(prev => [blockedTx, ...prev]);
        setStage('BLOCKED_ADDED');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const approvePending = (id: string) => {
    setFeed(prev => prev.map(item => 
      item.id === id 
        ? { 
            ...item, 
            status: 'APPROVED', 
            statusMessage: 'Approved — within research budget',
            txHash: '0x3c71...d88f'
          } 
        : item
    ));
    if (stage === 'PENDING_ADDED') setStage('APPROVED');
  };

  const declinePending = (id: string) => {
    setFeed(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: 'DECLINED', statusMessage: 'Declined by you' } 
        : item
    ));
    if (stage === 'PENDING_ADDED') setStage('APPROVED'); // Progress demo anyway
  };

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    if (id === 'r4' && stage === 'APPROVED') {
      setStage('RULE_DISABLED');
    }
  };

  return (
    <DemoContext.Provider value={{ feed, rules, stage, approvePending, declinePending, toggleRule }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used within a DemoProvider');
  return context;
}
