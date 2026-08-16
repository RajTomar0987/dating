import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { getSupabase } from '../services/supabase.js';
import { getProfileByFirebaseUid, createOrUpdateProfile } from '../services/profileStore.js';
import { cleanUsername, validateUsernameFormat, checkUsernameAvailable, generateUniqueUsername } from '../services/usernameStore.js';
import { z } from 'zod';

const router = Router();

const ProfileCompleteSchema = z.object({
  username: z.string().optional(),
  first_name: z.string().optional().default(''),
  display_name: z.string().optional().default(''),
  birthday: z.string().optional().default(''),
  gender: z.string().optional().default(''),
  interested_in: z.array(z.string()).optional().default([]),
  height_cm: z.number().nullable().optional(),
  education: z.string().nullable().optional(),
  occupation: z.string().nullable().optional(),
  languages: z.array(z.string()).optional().default([]),
  bio: z.string().optional().default(''),
  prompts: z.record(z.string()).nullable().optional(),
  interests: z.array(z.string()).optional().default([]),
  lifestyle: z.array(z.string()).optional().default([]),
  location_lat: z.number().nullable().optional(),
  location_lng: z.number().nullable().optional(),
  location_city: z.string().nullable().optional(),
  photos: z.array(z.string()).optional().default([]),
  profile_completed: z.boolean().optional().default(true),
});

const ProfileUpdateSchema = z.object({
  username: z.string().optional(),
  display_name: z.string().optional(),
  first_name: z.string().optional(),
  birthday: z.string().optional(),
  gender: z.string().optional(),
  interested_in: z.array(z.string()).optional(),
  height_cm: z.number().nullable().optional(),
  education: z.string().nullable().optional(),
  occupation: z.string().nullable().optional(),
  languages: z.array(z.string()).optional(),
  bio: z.string().optional(),
  prompts: z.record(z.string()).nullable().optional(),
  interests: z.array(z.string()).optional(),
  lifestyle: z.array(z.string()).optional(),
  location_lat: z.number().nullable().optional(),
  location_lng: z.number().nullable().optional(),
  location_city: z.string().nullable().optional(),
  photos: z.array(z.string()).optional(),
});

function calculateAge(birthday?: string | null): number | null {
  if (!birthday) return null;
  const birthDate = new Date(birthday);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function isUuid(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

function isTestOrDemoProfile(p: any): boolean {
  if (!p) return true;
  const uid = String(p.firebase_uid || p.id || '').toLowerCase();
  const name = String(p.display_name || p.first_name || '').toLowerCase();
  const email = String(p.email || '').toLowerCase();

  if (uid.startsWith('test_') || uid.startsWith('unit_') || uid.startsWith('demo_') || uid.startsWith('empty_birthday_') || uid.startsWith('chat_test_')) return true;
  if (email.endsWith('@auraai.test') || email.endsWith('@example.com') || email.endsWith('@test.com')) return true;
  if (name.startsWith('test') || name.startsWith('unit') || name.startsWith('sanitization') || name.startsWith('demo') || name.startsWith('chatuser') || name.startsWith('chat user')) return true;
  if (name === 'user' || name === 'user profile') return true;

  return false;
}

/**
 * GET /api/profiles/check-username?q=...
 * Check if a username is available (case-insensitive)
 */
router.get('/check-username', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const currentUid = req.user?.firebase_uid || req.user?.id;
  const rawQ = req.query.q || req.query.username;
  const candidate = cleanUsername(Array.isArray(rawQ) ? String(rawQ[0]) : String(rawQ || ''));

  if (!candidate) {
    res.status(400).json({ available: false, reason: 'Username cannot be empty.' });
    return;
  }

  const formatCheck = validateUsernameFormat(candidate);
  if (!formatCheck.valid) {
    res.status(400).json({ available: false, reason: formatCheck.reason || 'Invalid username format.' });
    return;
  }

  const isAvailable = await checkUsernameAvailable(candidate, currentUid);
  res.status(200).json({
    available: isAvailable,
    username: candidate,
    display: `@${candidate}`,
  });
});

/**
 * GET /api/profiles/discover
 * Discover real user profiles from Supabase (excluding current user and test/demo accounts)
 */
router.get('/discover', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const currentUserId = req.user?.firebase_uid || req.user?.id;
  if (!currentUserId) {
    res.status(401).json({ error: 'UNAUTHORIZED' });
    return;
  }

  try {
    const supabase = getSupabase();
    const { data: dbProfiles, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('firebase_uid', currentUserId)
      .limit(50);

    if (error) {
      console.error('[Profiles] Discover DB error:', error.message);
    }

    const realProfiles = (dbProfiles || []).filter((p: any) => !isTestOrDemoProfile(p) && p.profile_completed !== false);

    const formatted = realProfiles.map((p: any) => {
      const validPhotos = Array.isArray(p.photos)
        ? p.photos.filter((url: any) => typeof url === 'string' && url.trim().length > 0 && !url.trim().startsWith('blob:'))
        : [];

      return {
        id: p.firebase_uid || p.id,
        name: p.display_name || p.first_name || 'Member',
        age: calculateAge(p.birthday) || 24,
        birthday: p.birthday,
        gender: p.gender || 'Not specified',
        occupation: p.occupation || 'Member',
        location: p.location_city || 'Nearby',
        education: p.education || 'Graduate',
        bio: p.bio || 'Hello! Excited to meet new connections.',
        images: validPhotos.length ? validPhotos : ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'],
        interests: p.interests?.length ? p.interests : ['Travel', 'Music', 'Technology'],
        lifestyle: p.lifestyle?.length ? p.lifestyle : ['Active'],
        compatibilityScore: 94
      };
    });

    res.status(200).json({ profiles: formatted });
  } catch (err: any) {
    console.error('[Profiles] Discover error:', err);
    res.status(500).json({ error: 'Failed to fetch discovery profiles' });
  }
});

/**
 * GET /api/profiles/me
 * Get current authenticated user profile strictly via canonical Firebase UID
 */
router.get('/me', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const firebaseUid = req.user?.firebase_uid || req.user?.id;
    if (!firebaseUid) {
      res.status(401).json({ error: 'UNAUTHORIZED' });
      return;
    }

    console.log(`[PROFILE] GET /me for UID: ${firebaseUid}`);

    try {
      const dbProfile = await getProfileByFirebaseUid(firebaseUid);

      if (dbProfile) {
        console.log('[PROFILE] GET /me success. Found profile for UID:', firebaseUid);
        res.status(200).json({ profile: dbProfile });
        return;
      }

      console.warn('[PROFILE] PROFILE_NOT_FOUND (404) for UID:', firebaseUid);
      res.status(404).json({ error: 'PROFILE_NOT_FOUND', code: 'PROFILE_NOT_FOUND' });
    } catch (dbErr: any) {
      console.error('[PROFILE] Database error fetching profile:', dbErr?.message || dbErr);
      res.status(500).json({
        error: 'PROFILE_LOAD_FAILED',
        details: dbErr?.message || String(dbErr),
      });
    }
  } catch (err: any) {
    console.error('[PROFILE] Unexpected error in GET /me:', err);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

/**
 * GET /api/profiles/search?q=<query>
 * Real person search across registered database profiles
 */
router.get('/search', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const currentUid = req.user?.firebase_uid || req.user?.id;
    if (!currentUid) {
      res.status(401).json({ error: 'UNAUTHORIZED' });
      return;
    }

    const rawQ = req.query.q;
    const queryStr = (Array.isArray(rawQ) ? String(rawQ[0]) : String(rawQ || '')).trim().toLowerCase();
    if (!queryStr) {
      res.status(200).json({ profiles: [] });
      return;
    }

    // Strip leading @ for username searches
    const cleanQ = queryStr.replace(/^@+/, '').trim();

    const supabase = getSupabase();
    // Query database profiles excluding current user
    const { data: dbMatches, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('firebase_uid', currentUid)
      .limit(50);

    if (error) {
      console.warn('[Profiles/Search] Supabase query notice:', error.message);
    }

    // Filter real profiles and match across username, display_name, first_name, location, occupation, education, bio, or interests
    const realMatches = (dbMatches || []).filter((p: any) => {
      if (isTestOrDemoProfile(p) || p.profile_completed === false) return false;

      const username = String(p.username || p.prompts?.username || '').toLowerCase();
      const name = String(p.display_name || p.first_name || '').toLowerCase();
      const location = String(p.location_city || '').toLowerCase();
      const occupation = String(p.occupation || '').toLowerCase();
      const education = String(p.education || '').toLowerCase();
      const bio = String(p.bio || '').toLowerCase();
      const interests = Array.isArray(p.interests) ? p.interests.map((i: any) => String(i).toLowerCase()) : [];

      return (
        username === cleanQ ||
        username.includes(cleanQ) ||
        name.includes(cleanQ) ||
        location.includes(cleanQ) ||
        occupation.includes(cleanQ) ||
        education.includes(cleanQ) ||
        bio.includes(cleanQ) ||
        interests.some((i: string) => i.includes(cleanQ))
      );
    });

    // Prioritize exact username match first
    realMatches.sort((a: any, b: any) => {
      const uA = String(a.username || a.prompts?.username || '').toLowerCase();
      const uB = String(b.username || b.prompts?.username || '').toLowerCase();
      if (uA === cleanQ && uB !== cleanQ) return -1;
      if (uB === cleanQ && uA !== cleanQ) return 1;
      return 0;
    });

    // Return sanitized public profile objects (OMIT private auth data like firebase_uid & email)
    const results = realMatches.map((p: any) => {
      const validPhotos = Array.isArray(p.photos)
        ? p.photos.filter((url: any) => typeof url === 'string' && url.trim().length > 0 && !url.trim().startsWith('blob:'))
        : [];

      const mainImage = validPhotos.length ? validPhotos[0] : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
      const resolvedUser = cleanUsername(p.username || p.prompts?.username || 'aura_member');
      const userHandle = `@${resolvedUser}`;

      return {
        id: p.id || p.firebase_uid,
        username: resolvedUser,
        userHandle,
        type: 'profile',
        category: 'profile',
        name: p.display_name || p.first_name || 'Member',
        display_name: p.display_name || p.first_name || 'Member',
        first_name: p.first_name || p.display_name || 'Member',
        age: calculateAge(p.birthday) || 24,
        birthday: p.birthday || null,
        gender: p.gender || null,
        occupation: p.occupation || 'Member',
        location: p.location_city || 'Nearby',
        distance: p.location_city || 'Nearby',
        education: p.education || '',
        interests: p.interests || ['Travel', 'Music'],
        introText: p.bio || 'Hello! Looking for meaningful connections.',
        bio: p.bio || 'Hello! Looking for meaningful connections.',
        image: mainImage,
        images: validPhotos.length ? validPhotos : [mainImage],
        compatibility: 94,
        compatibilityScore: 94,
        verified: true,
        hasVoiceIntro: false,
        voiceDuration: '0:15',
        profile_completed: true,
      };
    });

    res.status(200).json({ profiles: results });
  } catch (err: any) {
    console.error('[Profiles/Search] Error:', err);
    res.status(500).json({ error: 'SEARCH_ERROR' });
  }
});

/**
 * GET /api/profiles/:id
 * Get profile by firebase_uid, id, or username
 */
router.get('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const targetId = (Array.isArray(rawId) ? String(rawId[0]) : String(rawId || '')).trim();
    if (!targetId) {
      res.status(400).json({ error: 'Missing target profile ID' });
      return;
    }

    let profile: any = null;
    try {
      profile = await getProfileByFirebaseUid(targetId);
    } catch (_) {}

    // Fallback 1: search by id column if targetId is UUID
    if (!profile && isUuid(targetId)) {
      try {
        const supabase = getSupabase();
        const { data } = await supabase.from('profiles').select('*').eq('id', targetId).maybeSingle();
        profile = data;
      } catch (_) {}
    }

    // Fallback 2: search by username (case-insensitive)
    if (!profile) {
      try {
        const cleanTarget = cleanUsername(targetId);
        const supabase = getSupabase();
        const { data: allProfiles } = await supabase.from('profiles').select('*');
        profile = (allProfiles || []).find((p: any) => cleanUsername(p.username || p.prompts?.username) === cleanTarget);
      } catch (_) {}
    }

    if (!profile) {
      res.status(404).json({ error: 'PROFILE_NOT_FOUND' });
      return;
    }

    res.status(200).json({ profile });
  } catch (err: any) {
    console.error('[Profiles/:id] Error:', err);
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

/**
 * POST /api/profiles/complete
 * Complete onboarding — upsert profile to Supabase using canonical Firebase UID
 */
router.post('/complete', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const firebaseUid = req.user?.firebase_uid || req.user?.id;

  if (!firebaseUid) {
    console.error('[PROFILE] Unauthorized: Missing user UID on POST /complete');
    res.status(401).json({ error: 'Unauthorized: Missing user UID' });
    return;
  }

  console.log(`[PROFILE] POST /complete for UID: ${firebaseUid}`);

  const parseResult = ProfileCompleteSchema.safeParse(req.body);
  if (!parseResult.success) {
    console.error('[PROFILE] Payload validation failed:', parseResult.error.errors);
    res.status(400).json({ error: 'Invalid profile data', details: parseResult.error.errors });
    return;
  }

  const payload = {
    ...parseResult.data,
    email: req.user?.email || parseResult.data.first_name || null,
    profile_completed: true,
  };

  try {
    const savedProfile = await createOrUpdateProfile(firebaseUid, payload);
    console.log('[PROFILE] POST /complete successful for UID:', firebaseUid);

    res.status(200).json({
      success: true,
      profile: savedProfile,
    });
  } catch (err: any) {
    console.error('[PROFILE] Save failed on POST /complete:', err?.message || err);
    res.status(500).json({
      error: 'PROFILE_SAVE_FAILED',
      details: err?.message || String(err),
    });
  }
});

/**
 * PUT /api/profiles/me
 * Update existing profile using canonical Firebase UID
 */
router.put('/me', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const firebaseUid = req.user?.firebase_uid || req.user?.id;
  if (!firebaseUid) {
    res.status(401).json({ error: 'Unauthorized: Missing user UID' });
    return;
  }

  const parseResult = ProfileUpdateSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: 'Invalid profile data', details: parseResult.error.errors });
    return;
  }

  try {
    const updatedProfile = await createOrUpdateProfile(firebaseUid, parseResult.data);
    res.status(200).json({
      success: true,
      profile: updatedProfile,
    });
  } catch (err: any) {
    console.error('[Profiles] PUT /me update error:', err);
    res.status(500).json({
      error: 'PROFILE_UPDATE_FAILED',
      details: err?.message || String(err),
    });
  }
});

/**
 * POST /api/profiles/photos
 */
router.post('/photos', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { photoUrl } = req.body;
  const firebaseUid = req.user?.firebase_uid || req.user?.id;

  if (!firebaseUid) {
    res.status(401).json({ error: 'UNAUTHORIZED' });
    return;
  }

  if (!photoUrl) {
    res.status(400).json({ error: 'Missing photoUrl' });
    return;
  }

  try {
    const profile = await getProfileByFirebaseUid(firebaseUid);
    const currentPhotos = profile?.photos || [];
    const updatedPhotos = [...currentPhotos, photoUrl];

    const savedProfile = await createOrUpdateProfile(firebaseUid, {
      ...profile,
      photos: updatedPhotos,
    });

    res.status(200).json({ success: true, message: 'Photo added', url: photoUrl, profile: savedProfile });
  } catch (err: any) {
    console.error('[Profiles] Photo upload error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

export default router;
