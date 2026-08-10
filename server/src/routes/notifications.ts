import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { getSupabase } from '../services/supabase.js';

const router = Router();

// Memory store fallback for notifications
export const inMemoryNotifications = new Map<string, any[]>();

export function addNotification(userId: string, title: string, message: string, type: string = 'system') {
  const notif = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    user_id: userId,
    title,
    message,
    notification_type: type,
    is_read: false,
    created_at: new Date().toISOString()
  };

  // Try DB insert
  try {
    const supabase = getSupabase();
    supabase.from('notifications').insert(notif).then(() => {}).catch(() => {});
  } catch (_) {}

  const current = inMemoryNotifications.get(userId) || [];
  inMemoryNotifications.set(userId, [notif, ...current]);
  return notif;
}

/**
 * GET /api/notifications
 * Get real notifications for authenticated user
 */
router.get('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const currentUserId = req.user?.firebase_uid || req.user?.id;
  if (!currentUserId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const supabase = getSupabase();
    const { data: dbNotifs, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', currentUserId)
      .order('created_at', { ascending: false });

    if (!error && dbNotifs && dbNotifs.length > 0) {
      res.status(200).json({ notifications: dbNotifs });
      return;
    }
  } catch (_) {}

  const fallback = inMemoryNotifications.get(currentUserId) || [];
  res.status(200).json({ notifications: fallback });
});

/**
 * POST /api/notifications/read
 * Mark notifications as read
 */
router.post('/read', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const currentUserId = req.user?.firebase_uid || req.user?.id;
  if (!currentUserId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const supabase = getSupabase();
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', currentUserId);
  } catch (_) {}

  const list = inMemoryNotifications.get(currentUserId) || [];
  list.forEach(n => n.is_read = true);

  res.status(200).json({ success: true });
});

export default router;
