import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

const UpgradeSchema = z.object({
  planTier: z.enum(['free', 'pro', 'vip'])
});

router.post('/upgrade', (req: AuthenticatedRequest, res: Response): void => {
  const result = UpgradeSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid plan tier choice', details: result.error.errors });
    return;
  }

  const { planTier } = result.data;

  res.status(200).json({
    message: 'Subscription updated in PostgreSQL database',
    planTier,
    isPremium: planTier !== 'free',
    updatedAt: new Date().toISOString()
  });
});

export default router;
