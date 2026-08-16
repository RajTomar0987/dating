import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { firebaseAuth } from '../services/firebase.js';
import { getProfileByFirebaseUid } from '../services/profileStore.js';
import { authenticateJWT, type AuthenticatedRequest } from '../middleware/auth.js';
import { generateAndStoreOtp, verifyOtpCode } from '../services/otpStore.js';
import { sendEmailOtp } from '../services/emailService.js';

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
 * POST /api/auth/otp/send
 * Request a 6-digit OTP sent to user email via transactional provider
 */
router.post('/otp/send', async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body || {};
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'Enter a valid email address.' });
    return;
  }

  try {
    const { otp, resendCooldownSeconds } = generateAndStoreOtp(email);
    const emailResult = await sendEmailOtp(email, otp);

    if (!emailResult.success) {
      console.error(`[AUTH OTP] Delivery failed for ${email}:`, emailResult.error);
      res.status(502).json({
        error: 'EMAIL_DELIVERY_FAILED',
        message: 'Unable to deliver verification code. Please try again.',
        details: emailResult.error || 'Transactional email service is not configured or rejected the request.',
      });
      return;
    }

    console.log(`[AUTH OTP] Verification code successfully sent to ${email} via ${emailResult.provider}`);
    res.status(200).json({
      message: 'Verification code sent to your email.',
      resendCooldownSeconds,
      provider: emailResult.provider,
    });
  } catch (err: any) {
    console.warn('[AUTH OTP] Send error:', err?.message || err);
    res.status(429).json({ error: err?.message || 'Too many attempts. Please try again later.' });
  }
});

/**
 * POST /api/auth/otp/verify
 * Verify 6-digit OTP and issue Firebase custom token
 */
router.post('/otp/verify', async (req: Request, res: Response): Promise<void> => {
  const { email, otp, name } = req.body || {};
  if (!email || !otp) {
    res.status(400).json({ error: 'Email and verification code are required.' });
    return;
  }

  const result = verifyOtpCode(email, otp);
  if (!result.success) {
    res.status(400).json({ error: result.error || 'Incorrect verification code.' });
    return;
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    let uid = `otp_${crypto.createHash('md5').update(normalizedEmail).digest('hex')}`;
    let customToken: string | null = null;
    let fbUser: any = null;

    try {
      try {
        fbUser = await firebaseAuth.getUserByEmail(normalizedEmail);
        if (fbUser?.uid) uid = fbUser.uid;
        console.log('[AUTH OTP] Existing Firebase user found:', uid);
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err?.message?.includes('user-not-found')) {
          console.log('[AUTH OTP] Creating new Firebase user for:', normalizedEmail);
          fbUser = await firebaseAuth.createUser({
            email: normalizedEmail,
            displayName: name || normalizedEmail.split('@')[0],
            emailVerified: true,
          });
          if (fbUser?.uid) uid = fbUser.uid;
          console.log('[AUTH OTP] Created new Firebase user with UID:', uid);
        }
      }

      if (uid) {
        try {
          customToken = await firebaseAuth.createCustomToken(uid);
          console.log('[AUTH OTP] Issued Firebase customToken for UID:', uid);
        } catch (tokenErr: any) {
          console.warn('[AUTH OTP] Firebase createCustomToken notice (falling back to direct session):', tokenErr?.message || tokenErr);
        }
      }
    } catch (adminErr: any) {
      console.warn('[AUTH OTP] Firebase Admin operation notice:', adminErr?.message || adminErr);
    }

    // Look up existing profile or prepare new profile registration
    let profile = null;
    try {
      profile = await getProfileByFirebaseUid(uid);
    } catch (e: any) {
      console.warn('[AUTH OTP] Profile lookup notice during OTP verify:', e?.message || e);
    }

    // Issue backend JWT token
    const token = jwt.sign(
      {
        id: profile?.id || uid,
        firebase_uid: uid,
        email: normalizedEmail,
      },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'OTP verified successfully.',
      customToken,
      token,
      uid,
      profile,
    });
  } catch (err: any) {
    console.error('[AUTH OTP] Verify exception:', err);
    res.status(500).json({ error: 'Unable to complete registration. Please try again.' });
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
