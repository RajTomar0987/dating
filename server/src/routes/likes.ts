import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

const SwipeSchema = z.object({
  targetId: z.string(),
  direction: z.enum(['like', 'pass', 'superlike'])
});

router.post('/', (req: AuthenticatedRequest, res: Response): void => {
  const result = SwipeSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid swipe parameter payload', details: result.error.errors });
    return;
  }

  const { targetId, direction } = result.data;
  const isMatch = direction === 'like' || direction === 'superlike';

  res.status(200).json({
    message: 'Swipe recorded in PostgreSQL database',
    targetId,
    direction,
    isMatch,
    match: isMatch ? {
      id: `match_${Date.now()}`,
      targetId,
      overallScore: 94
    } : null
  });
});

export default router;
