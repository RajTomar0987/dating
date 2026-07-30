import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'aura_ai_jwt_secret_dev_key_2026';

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const SignupSchema = AuthSchema.extend({
  name: z.string().min(2)
});

router.post('/login', (req: Request, res: Response): void => {
  const result = AuthSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid email or password format', details: result.error.errors });
    return;
  }

  const { email } = result.data;
  const token = jwt.sign({ id: 'user_alex_mercer_01', email }, JWT_SECRET, { expiresIn: '7d' });

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: 'user_alex_mercer_01',
      email,
      name: 'Alex Mercer'
    }
  });
});

router.post('/signup', (req: Request, res: Response): void => {
  const result = SignupSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid signup input parameters', details: result.error.errors });
    return;
  }

  const { email, name } = result.data;
  const userId = `user_${Date.now()}`;
  const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    message: 'Profile registration successful',
    token,
    user: {
      id: userId,
      email,
      name
    }
  });
});

export default router;
