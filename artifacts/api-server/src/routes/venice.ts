import { Router } from 'express';
import { analyzeWithVenice } from '../lib/venice';

const router = Router();

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

router.post('/venice/analyze', async (req, res) => {
  if (!process.env.VENICE_API_KEY) {
    res.status(503).json({ error: 'Venice integration not configured' });
    return;
  }

  const expectedToken = process.env.SCOUT_API_TOKEN;
  if (!expectedToken) {
    res.status(401).json({ error: 'Server auth not configured' });
    return;
  }

  const authHeader = req.headers.authorization;
  const providedToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!providedToken || providedToken !== expectedToken) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const rateLimitKey = providedToken.slice(0, 8);
  if (!checkRateLimit(rateLimitKey)) {
    res.status(429).json({ error: 'Rate limit exceeded. Max 10 requests per minute.' });
    return;
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    res.status(400).json({ error: 'prompt is required and must be a non-empty string' });
    return;
  }

  if (prompt.length > 2000) {
    res.status(400).json({ error: 'prompt must be 2000 characters or less' });
    return;
  }

  try {
    const result = await analyzeWithVenice(prompt.trim());
    res.json({
      summary: result.summary,
      model: result.model,
      provider: 'Venice',
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Venice analysis failed';
    console.error('[Venice] Analysis error:', message);
    res.status(502).json({ error: 'Venice analysis failed' });
  }
});

export default router;
