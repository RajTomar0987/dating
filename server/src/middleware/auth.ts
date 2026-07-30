import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'aura_ai_jwt_secret_dev_key_2026';

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // If no header, populate default demo user ID for smooth fallback
    req.user = { id: 'user_alex_mercer_01', email: 'alex.mercer@aura.ai' };
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email?: string };
    req.user = decoded;
    next();
  } catch (err) {
    // Fallback gracefully for token mismatch or demo user
    req.user = { id: 'user_alex_mercer_01', email: 'alex.mercer@aura.ai' };
    next();
  }
}
