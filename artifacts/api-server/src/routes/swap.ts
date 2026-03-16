import { Router } from 'express';
import { isAddress, parseUnits } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import {
  TOKEN_ALLOWLIST,
  SLIPPAGE_CEILING,
  checkApproval,
  getQuote,
  executeSwap,
} from '../lib/uniswap.js';

const swapRouter = Router();

/**
 * POST /swap
 *
 * Example request body:
 * {
 *   "tokenIn": "0x0000000000000000000000000000000000000000",
 *   "tokenOut": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
 *   "amount": "0.001",
 *   "type": "EXACT_INPUT"
 * }
 *
 * tokenIn/tokenOut: token addresses (use 0x000...000 for native ETH)
 * amount: human-readable amount (e.g. "0.001" for 0.001 ETH)
 * type: "EXACT_INPUT" or "EXACT_OUTPUT"
 */
swapRouter.post('/swap', async (req, res) => {
  try {
    const { tokenIn, tokenOut, amount, type } = req.body;

    if (!tokenIn || !tokenOut || !amount || !type) {
      res.status(400).json({ error: 'Missing required fields: tokenIn, tokenOut, amount, type' });
      return;
    }

    if (!isAddress(tokenIn) || !isAddress(tokenOut)) {
      res.status(400).json({ error: 'Invalid token address' });
      return;
    }

    if (type !== 'EXACT_INPUT' && type !== 'EXACT_OUTPUT') {
      res.status(400).json({ error: 'type must be EXACT_INPUT or EXACT_OUTPUT' });
      return;
    }

    const tokenInNorm = tokenIn.toLowerCase();
    const tokenOutNorm = tokenOut.toLowerCase();

    const tokenInConfig = TOKEN_ALLOWLIST[tokenInNorm];
    const tokenOutConfig = TOKEN_ALLOWLIST[tokenOutNorm];

    if (!tokenInConfig) {
      res.status(403).json({ error: `tokenIn not in allowlist. Allowed: ${Object.keys(TOKEN_ALLOWLIST).join(', ')}` });
      return;
    }

    if (!tokenOutConfig) {
      res.status(403).json({ error: `tokenOut not in allowlist. Allowed: ${Object.keys(TOKEN_ALLOWLIST).join(', ')}` });
      return;
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      res.status(400).json({ error: 'amount must be a positive number' });
      return;
    }

    const amountToken = type === 'EXACT_INPUT' ? tokenInConfig : tokenOutConfig;
    const capToken = type === 'EXACT_INPUT' ? tokenInConfig : tokenOutConfig;
    const maxAmount = Number(capToken.maxAmount);
    if (amountNum > maxAmount) {
      res.status(400).json({
        error: `Amount exceeds per-swap cap: max ${capToken.maxAmount} ${capToken.symbol}`,
      });
      return;
    }

    const rawKey = process.env.SCOUT_PRIVATE_KEY?.trim();
    if (!rawKey) {
      res.status(500).json({ error: 'SCOUT_PRIVATE_KEY not configured' });
      return;
    }

    const key = rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`;
    const account = privateKeyToAccount(key as `0x${string}`);
    const swapper = account.address;

    const amountRaw = parseUnits(amount, amountToken.decimals).toString();

    console.log(`[swap] ${amount} ${tokenInConfig.symbol} → ${tokenOutConfig.symbol} (${type}) swapper=${swapper}`);

    const approvalAmountRaw = type === 'EXACT_INPUT'
      ? amountRaw
      : parseUnits(tokenInConfig.maxAmount, tokenInConfig.decimals).toString();

    const approvalResult = await checkApproval({
      token: tokenIn,
      amount: approvalAmountRaw,
      walletAddress: swapper,
    });

    if (approvalResult.approval) {
      res.status(400).json({
        error: 'Token approval (Permit2) is required before swapping this token. Approval transactions are not yet supported in this endpoint.',
      });
      return;
    }

    const quoteResponse = await getQuote({
      tokenIn,
      tokenOut,
      amount: amountRaw,
      type: type as 'EXACT_INPUT' | 'EXACT_OUTPUT',
      swapper,
      slippageTolerance: SLIPPAGE_CEILING,
    });

    console.log(`[swap] Quote received, gasFeeUSD=${quoteResponse.gasFeeUSD ?? 'unknown'}`);

    const result = await executeSwap(quoteResponse);

    console.log(`[swap] Transaction broadcasted: ${result.txHash}`);

    res.json({
      success: true,
      txHash: result.txHash,
      gasFeeUSD: result.gasFeeUSD,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[swap] Error:', message);
    res.status(500).json({ error: message });
  }
});

export default swapRouter;
