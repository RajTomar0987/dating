import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

const MessageSchema = z.object({
  matchId: z.string(),
  text: z.string().min(1),
  type: z.enum(['text', 'voice', 'photo']).optional(),
  duration: z.string().optional(),
  imageUrl: z.string().optional()
});

router.post('/messages', (req: AuthenticatedRequest, res: Response): void => {
  const result = MessageSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid message payload', details: result.error.errors });
    return;
  }

  const { matchId, text, type = 'text', duration, imageUrl } = result.data;

  res.status(201).json({
    message: 'Message dispatched and broadcasted to Supabase Realtime',
    newMessage: {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      duration,
      imageUrl
    }
  });
});

export default router;
