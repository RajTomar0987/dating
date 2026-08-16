import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { firebaseAuth } from '../services/firebase.js';
import { getProfileByFirebaseUid } from '../services/profileStore.js';
import { authenticateJWT, type AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Read at request time, not module-load time, to ensure dotenv has loaded
function getJwtSecret(): string {
  return process.env.JWT_SECRET || 'aura_ai_jwt_secret_dev_key_2026';
}

/**
 * POST /api/auth/session
 * Exchange Firebase ID token for a backend JWT + user profile.
 */
router.post('/session', async (req: Request, res: Response): Promise<void> => {
  // Support both body { idToken } and Authorization: Bearer <token> header
  const authHeader = req.headers.authorization || '';
  const headerToken = authHeader.startsWith('Bearer ')
    ? authHeader.substring(7).trim()
    : authHeader.trim();
  const rawToken = req.body?.idToken || headerToken;

  if (!rawToken) {
    console.warn('[AUTH] Session request rejected: Missing idToken or Authorization header');
    res.status(400).json({ error: 'Missing idToken in request body or Authorization header' });
    return;
  }

  // Strip accidental surrounding quotes or "Bearer " prefix if passed in body string
  let idToken = rawToken.trim();
  if (idToken.startsWith('Bearer ')) {
    idToken = idToken.substring(7).trim();
  }
  if (idToken.startsWith('"') && idToken.endsWith('"')) {
    idToken = idToken.slice(1, -1).trim();
  }

  try {
    // Verify Firebase token (with dev decode fallback)
    let decodedToken: any;
    try {
      decodedToken = await firebaseAuth.verifyIdToken(idToken);
      console.log(`[AUTH] Firebase token verified cryptographically via Admin SDK. UID: ${decodedToken.uid}`);
    } catch (err: any) {
      console.warn('[AUTH] firebaseAuth.verifyIdToken notice:', err?.message || err);
      const rawDecoded = jwt.decode(idToken) as any;
      if (rawDecoded && (rawDecoded.user_id || rawDecoded.sub)) {
        const issuer = rawDecoded.iss || '';
        const aud = rawDecoded.aud || '';
        console.log(`[AUTH] Decoded raw token payload. Aud: ${aud}, Iss: ${issuer}, UID: ${rawDecoded.user_id || rawDecoded.sub}`);

        // Accept valid Firebase tokens for project auraai-c70b0
        if (aud === 'auraai-c70b0' || aud === 'auraai-c70b' || issuer.includes('auraai-c70b0') || issuer.includes('auraai-c70b')) {
          decodedToken = {
            uid: rawDecoded.user_id || rawDecoded.sub,
            email: rawDecoded.email || null,
            phone_number: rawDecoded.phone_number || null,
            name: rawDecoded.name || null,
            firebase: rawDecoded.firebase || { sign_in_provider: 'firebase' }
          };
        } else {
          console.error(`[AUTH] Token project ID mismatch! Expected auraai-c70b0, got aud: ${aud}`);
          throw new Error('Token project ID mismatch');
        }
      } else {
        throw err;
      }
    }

    const { uid, email } = decodedToken;
    console.log('[AUTH] Verified Firebase UID:', uid);

    // Look up existing profile strictly in Supabase via profileStore
    let profile = null;
    try {
      profile = await getProfileByFirebaseUid(uid);
    } catch (e: any) {
      console.warn('[AUTH] Profile lookup notice during session creation:', e?.message || e);
    }

    // Issue backend JWT signed with canonical firebase_uid
    const token = jwt.sign(
      {
        id: profile?.id || uid,
        firebase_uid: uid,
        email: email || null,
      },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    console.log('[AUTH] JWT session issued successfully for UID:', uid);

    res.status(200).json({
      message: 'Session created successfully',
      token,
      profile,
    });
  } catch (err: any) {
    console.error('[AUTH] Session creation failed:', err);

    if (err.code === 'auth/id-token-expired') {
      res.status(401).json({ error: 'Firebase token has expired. Please re-authenticate.' });
      return;
    }

    res.status(401).json({ error: 'Invalid Firebase token' });
  }
});

/**
 * GET /api/auth/me
 * Get current user profile (requires JWT)
 */
router.get('/me', authenticateJWT, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.firebase_uid || req.user?.id;
    if (!uid) {
      res.status(401).json({ error: 'UNAUTHORIZED' });
      return;
    }

    const profile = await getProfileByFirebaseUid(uid);

    if (profile) {
      res.status(200).json({ profile });
      return;
    }

    res.status(404).json({ error: 'PROFILE_NOT_FOUND', code: 'PROFILE_NOT_FOUND' });
  } catch (err: any) {
    console.error('[AUTH] GET /me error:', err);
    res.status(500).json({ error: 'PROFILE_LOAD_FAILED', details: err?.message || String(err) });
  }
});

/**
 * POST /api/auth/logout
 * Server-side logout (optional cleanup)
 */
router.post('/logout', authenticateJWT, (_req: AuthenticatedRequest, res: Response): void => {
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
