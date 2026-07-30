import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

const WingmanSchema = z.object({
  inputText: z.string().min(1)
});

router.post('/analyze', (req: AuthenticatedRequest, res: Response): void => {
  const result = WingmanSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid Wingman input text', details: result.error.errors });
    return;
  }

  const { inputText } = result.data;

  res.status(200).json({
    id: `wingman_${Date.now()}`,
    inputText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    emotion: "Curious, slightly sarcastic but intellectually engaged",
    intent: "Seeking a collaborative vibe check & testing analytical alignment",
    confidence: 94,
    replies: {
      funny: "I'll co-sign that statement, as long as it doesn't violate my local security protocols. Shall we benchmark it in person?",
      flirty: "Your personality vector seems to have a direct positive pull on mine. How about we test this alignment over coffee?",
      deep: "I agree that complex systems are beautiful when they work. The transition from random bits to order is fascinating. What drew you to study that?",
      professional: "That makes complete sense. I also prefer setting structured goals. Shall we sync coordinates for a meetup this week?"
    }
  });
});

export default router;
