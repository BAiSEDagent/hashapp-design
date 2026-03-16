import {
  createWalletClient,
  createPublicClient,
  http,
  type Hex,
  type TransactionRequest,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';

const TRADING_API_BASE = 'https://trade-api.gateway.uniswap.org/v1';
const CHAIN_ID = '84532';

const NATIVE_ETH = '0x0000000000000000000000000000000000000000';
const BASE_SEPOLIA_USDC = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
const BASE_SEPOLIA_UNIVERSAL_ROUTER = '0x492e6456d9528771018deb9e87ef7750ef184104';

export const TOKEN_ALLOWLIST: Record<string, { symbol: string; decimals: number; maxAmount: string }> = {
  [NATIVE_ETH]: { symbol: 'ETH', decimals: 18, maxAmount: '0.01' },
  [BASE_SEPOLIA_USDC.toLowerCase()]: { symbol: 'USDC', decimals: 6, maxAmount: '50' },
};

export const SLIPPAGE_CEILING = 2;

function getHeaders(): Record<string, string> {
  const apiKey = process.env.UNISWAP_API_KEY;
  if (!apiKey) {
    throw new Error('UNISWAP_API_KEY not configured');
  }
  return {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'x-universal-router-version': '2.0',
  };
}

function getScoutAccount() {
  const rawKey = process.env.SCOUT_PRIVATE_KEY?.trim();
  if (!rawKey) {
    throw new Error('SCOUT_PRIVATE_KEY not configured');
  }
  const key: Hex = rawKey.startsWith('0x')
    ? (rawKey as Hex)
    : (`0x${rawKey}` as Hex);
  return privateKeyToAccount(key);
}

export interface CheckApprovalParams {
  token: string;
  amount: string;
  walletAddress: string;
}

export interface CheckApprovalResponse {
  approval?: {
    to: string;
    data: string;
    value: string;
    chainId: string;
  };
  gasFeeUSD?: string;
}

export async function checkApproval(params: CheckApprovalParams): Promise<CheckApprovalResponse> {
  const body = {
    token: params.token,
    amount: params.amount,
    chainId: CHAIN_ID,
    walletAddress: params.walletAddress,
  };

  const res = await fetch(`${TRADING_API_BASE}/check_approval`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`check_approval failed (${res.status}): ${text}`);
  }

  return (await res.json()) as CheckApprovalResponse;
}

export interface GetQuoteParams {
  tokenIn: string;
  tokenOut: string;
  amount: string;
  type: 'EXACT_INPUT' | 'EXACT_OUTPUT';
  swapper: string;
  slippageTolerance?: number;
}

export async function getQuote(params: GetQuoteParams): Promise<Record<string, unknown>> {
  const body = {
    type: params.type,
    tokenInChainId: CHAIN_ID,
    tokenOutChainId: CHAIN_ID,
    tokenIn: params.tokenIn,
    tokenOut: params.tokenOut,
    amount: params.amount,
    swapper: params.swapper,
    slippageTolerance: params.slippageTolerance ?? SLIPPAGE_CEILING,
    protocols: ['V2', 'V3', 'V4'],
  };

  const res = await fetch(`${TRADING_API_BASE}/quote`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`quote failed (${res.status}): ${text}`);
  }

  return (await res.json()) as Record<string, unknown>;
}

export interface SwapResult {
  txHash: string;
  gasFeeUSD?: string;
}

export async function executeSwap(quoteResponse: Record<string, unknown>): Promise<SwapResult> {
  const gasFeeUSD = quoteResponse.gasFeeUSD as string | undefined;

  const swapBody = { ...quoteResponse };

  const hasPermitData = swapBody.permitData !== null && swapBody.permitData !== undefined;
  const hasSignature = swapBody.signature !== null && swapBody.signature !== undefined;
  if (hasPermitData !== hasSignature) {
    if (!hasPermitData) {
      delete swapBody.signature;
    } else {
      throw new Error('permitData is present but signature is missing');
    }
  }
  if (!hasPermitData) {
    delete swapBody.permitData;
    delete swapBody.signature;
  }

  const res = await fetch(`${TRADING_API_BASE}/swap`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(swapBody),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`swap failed (${res.status}): ${text}`);
  }

  const swapData = (await res.json()) as { swap: { to: string; data: string; value: string; chainId: string } };

  if (swapData.swap.chainId !== CHAIN_ID) {
    throw new Error(`Unexpected chainId in swap response: ${swapData.swap.chainId} (expected ${CHAIN_ID})`);
  }

  if (swapData.swap.to.toLowerCase() !== BASE_SEPOLIA_UNIVERSAL_ROUTER) {
    throw new Error(`Unexpected swap target: ${swapData.swap.to} (expected Universal Router ${BASE_SEPOLIA_UNIVERSAL_ROUTER})`);
  }

  const account = getScoutAccount();

  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(),
  });

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  const tx: TransactionRequest = {
    to: swapData.swap.to as Hex,
    data: swapData.swap.data as Hex,
    value: BigInt(swapData.swap.value || '0'),
  };

  const txHash = await walletClient.sendTransaction({
    to: tx.to as Hex,
    data: tx.data as Hex,
    value: tx.value,
    chain: baseSepolia,
    account,
  });

  await publicClient.waitForTransactionReceipt({ hash: txHash, timeout: 60_000 });

  return { txHash, gasFeeUSD };
}
