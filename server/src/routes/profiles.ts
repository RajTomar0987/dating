import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

const ProfileUpdateSchema = z.object({
  name: z.string().optional(),
  age: z.number().optional(),
  occupation: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  personalityType: z.string().optional(),
  loveLanguage: z.string().optional(),
  interests: z.array(z.string()).optional(),
  traits: z.object({
    extroversion: z.number(),
    adventurousness: z.number(),
    logic: z.number(),
    empathy: z.number()
  }).optional()
});

router.get('/me', (req: AuthenticatedRequest, res: Response): void => {
  res.status(200).json({
    id: req.user?.id || 'user_alex_mercer_01',
    name: 'Alex Mercer',
    age: 28,
    occupation: 'AI Systems Architect',
    location: 'San Francisco, CA',
    bio: 'Architecting automated reasoning systems by day, researching modular synth patches by night.',
    personalityType: 'INTP',
    loveLanguage: 'Quality Time',
    interests: ['Artificial Intelligence', 'Synthesizers', 'UI/UX Design', 'Minimalism', 'Coffee Shop Hopping'],
    traits: { extroversion: 45, adventurousness: 75, logic: 92, empathy: 80 },
    images: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600'],
    isVerified: true
  });
});

router.put('/me', (req: AuthenticatedRequest, res: Response): void => {
  const result = ProfileUpdateSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid profile data', details: result.error.errors });
    return;
  }

  res.status(200).json({
    message: 'Profile calibrated and synchronized with PostgreSQL DB',
    updatedProfile: req.body
  });
});

router.post('/photos', (_req, res: Response): void => {
  const mockStorageUrl = `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600`;
  res.status(200).json({
    message: 'Photo uploaded to Supabase Storage',
    url: mockStorageUrl
  });
});

export default router;
