import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { createOrGetMatch } from '../services/chatStore.js';
import { z } from 'zod';

const router = Router();

const SwipeSchema = z.object({
  targetId: z.string().min(1),
  direction: z.enum(['like', 'pass', 'superlike'])
});

router.post('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const currentUserId = req.user?.firebase_uid || req.user?.id;
  if (!currentUserId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const result = SwipeSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid swipe parameter payload', details: result.error.errors });
    return;
  }

  const { targetId, direction } = result.data;
  const isMatch = direction === 'like' || direction === 'superlike';

  let matchRecord = null;
  if (isMatch) {
    matchRecord = await createOrGetMatch(currentUserId, targetId);
  }

  res.status(200).json({
    message: 'Swipe recorded',
    targetId,
    direction,
    isMatch,
    match: matchRecord ? {
      id: matchRecord.id,
      targetId,
      status: matchRecord.status
    } : null
  });
});

export default router;
