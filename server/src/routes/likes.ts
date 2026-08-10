import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { createOrGetMatch } from '../services/chatStore.js';
import { getSupabase } from '../services/supabase.js';
import { addNotification } from './notifications.js';
import { z } from 'zod';

const router = Router();

const SwipeSchema = z.object({
  targetId: z.string().min(1),
  direction: z.enum(['like', 'pass', 'superlike'])
});

// In-memory fallback swipe store
export const inMemorySwipes = new Map<string, { user_id: string; target_id: string; direction: string }>();

router.delete('/reset', async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  inMemorySwipes.clear();
  try {
    const supabase = getSupabase();
    await supabase.from('swipes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('matches').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  } catch (_) {}
  res.status(200).json({ success: true, message: 'Swipes and matches reset for clean test execution' });
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

  // Prevent liking oneself
  if (currentUserId === targetId) {
    res.status(400).json({ error: 'Cannot like yourself' });
    return;
  }

  const supabase = getSupabase();
  const swipeKey = `${currentUserId}_${targetId}`;

  // 1. Record swipe in Supabase (or memory)
  try {
    await supabase.from('swipes').upsert(
      {
        user_id: currentUserId,
        target_id: targetId,
        direction,
        created_at: new Date().toISOString()
      },
      { onConflict: 'user_id,target_id' }
    );
  } catch (err) {
    console.warn('[Likes] Supabase swipe insert notice:', err);
  }
  inMemorySwipes.set(swipeKey, { user_id: currentUserId, target_id: targetId, direction });

  let isMatch = false;
  let matchRecord = null;

  // 2. If direction is like/superlike, check if target user already liked current user
  if (direction === 'like' || direction === 'superlike') {
    let hasReciprocalLike = false;

    try {
      const { data: reciprocalSwipe } = await supabase
        .from('swipes')
        .select('*')
        .eq('user_id', targetId)
        .eq('target_id', currentUserId)
        .in('direction', ['like', 'superlike'])
        .maybeSingle();

      if (reciprocalSwipe) {
        hasReciprocalLike = true;
      }
    } catch (_) {}

    if (!hasReciprocalLike) {
      const memReciprocal = inMemorySwipes.get(`${targetId}_${currentUserId}`);
      if (memReciprocal && (memReciprocal.direction === 'like' || memReciprocal.direction === 'superlike')) {
        hasReciprocalLike = true;
      }
    }

    // 3. If reciprocal match, create match record & notify both users
    if (hasReciprocalLike) {
      isMatch = true;
      matchRecord = await createOrGetMatch(currentUserId, targetId);

      addNotification(currentUserId, "It's a Match! 🎉", "You and your match liked each other. Start a conversation now!", "match");
      addNotification(targetId, "It's a Match! 🎉", "You have a new match! Open chats to message them.", "match");
    }
  }

  res.status(200).json({
    message: isMatch ? 'Match created!' : 'Swipe recorded',
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
