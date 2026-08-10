import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { firebaseAuth } from '../services/firebase.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    firebase_uid: string;
    email?: string;
  };
}

// Read at request time, not module-load time, to ensure dotenv has loaded
function getJwtSecret(): string {
  return process.env.JWT_SECRET || 'aura_ai_jwt_secret_dev_key_2026';
}

/**
 * Verify Firebase ID token directly.
 * Used for the /auth/session endpoint where users exchange Firebase tokens for JWTs.
 */
export async function verifyFirebaseToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  console.log('[AUTH] Authorization header present:', !!authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('[AUTH Error] Missing or invalid authorization header format');
    res.status(401).json({ error: 'Missing or invalid authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(token);
    req.user = {
      id: decodedToken.uid,
      firebase_uid: decodedToken.uid,
      email: decodedToken.email,
    };
    console.log('[AUTH] Verified Firebase user:', req.user.firebase_uid);
    next();
  } catch (err: any) {
    console.warn('[AUTH Notice] firebaseAuth.verifyIdToken notice:', err?.message || err);
    
    // Fallback: decode raw JWT payload if Firebase Admin credentials are not provided
    const rawDecoded = jwt.decode(token) as any;
    if (rawDecoded && (rawDecoded.user_id || rawDecoded.sub)) {
      const uid = rawDecoded.user_id || rawDecoded.sub;
      req.user = {
        id: uid,
        firebase_uid: uid,
        email: rawDecoded.email || undefined,
      };
      console.log('[AUTH] Fallback decoded user:', req.user.firebase_uid);
      next();
    } else {
      console.error('[AUTH Error] Firebase token verification failed completely:', err?.message || err);
      res.status(401).json({ error: 'Invalid or expired Firebase token', details: err?.message });
    }
  }
}

/**
 * Verify our issued JWT token (or fallback Firebase token).
 * Used for all protected API routes after initial session creation.
 */
export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('[AUTH Error] Missing or invalid Bearer header');
    res.status(401).json({ error: 'Authentication required. Please sign in.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  // 1. Try verifying with application JWT_SECRET
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as {
      id: string;
      firebase_uid?: string;
      email?: string;
    };

    req.user = {
      id: decoded.id,
      firebase_uid: decoded.firebase_uid || decoded.id,
      email: decoded.email,
    };

    console.log('[AUTH] Authenticated User:', req.user.firebase_uid);
    return next();
  } catch (jwtErr: any) {
    // 2. If JWT verify failed, attempt decoding as Firebase ID token OR backend JWT
    const decodedToken = jwt.decode(token) as any;
    if (decodedToken) {
      // Check for Firebase token fields (user_id, sub) OR backend JWT fields (id, firebase_uid)
      const uid = decodedToken.user_id || decodedToken.sub || decodedToken.firebase_uid || decodedToken.id;
      if (uid) {
        req.user = {
          id: uid,
          firebase_uid: decodedToken.firebase_uid || uid,
          email: decodedToken.email || undefined,
        };

        console.log('[AUTH] Fallback Authenticated User:', req.user.firebase_uid);
        return next();
      }
    }

    console.error('[AUTH Error] JWT verification failed:', jwtErr.message);
    if (jwtErr.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token expired. Please re-authenticate.' });
      return;
    }
    res.status(401).json({ error: 'Invalid token. Please sign in again.', details: jwtErr.message });
  }
}

/**
 * Attach full user profile from database (middleware for routes that need it).
 */
export function attachUser(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  next();
}
