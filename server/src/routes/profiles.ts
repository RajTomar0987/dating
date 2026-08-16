import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { getSupabase } from '../services/supabase.js';
import { getProfileByFirebaseUid, createOrUpdateProfile } from '../services/profileStore.js';
import { z } from 'zod';

const router = Router();

const ProfileCompleteSchema = z.object({
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

/**
 * GET /api/profiles/discover
 * Discover user profiles from Supabase (excluding current user)
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

    const allProfiles = dbProfiles || [];

    const formatted = allProfiles.map((p: any) => ({
      id: p.firebase_uid || p.id,
      name: p.display_name || p.first_name || 'User Profile',
      age: calculateAge(p.birthday) || 24,
      birthday: p.birthday,
      gender: p.gender || 'Not specified',
      occupation: p.occupation || 'Member',
      location: p.location_city || 'Nearby',
      education: p.education || 'Graduate',
      bio: p.bio || 'Hello! Excited to meet new connections.',
      images: p.photos?.length ? p.photos : ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'],
      interests: p.interests?.length ? p.interests : ['Travel', 'Music', 'Technology'],
      lifestyle: p.lifestyle?.length ? p.lifestyle : ['Active'],
      compatibilityScore: 94
    }));

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
 * User search across profiles
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
    if (!queryStr || queryStr.length < 2) {
      res.status(200).json({ profiles: [] });
      return;
    }

    const supabase = getSupabase();
    const { data: dbMatches, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('firebase_uid', currentUid)
      .or(`display_name.ilike.%${queryStr}%,first_name.ilike.%${queryStr}%,location_city.ilike.%${queryStr}%,occupation.ilike.%${queryStr}%,education.ilike.%${queryStr}%,bio.ilike.%${queryStr}%`)
      .limit(10);

    if (error) {
      console.warn('[Profiles/Search] Supabase query notice:', error.message);
    }

    const results = (dbMatches || []).map((p: any) => ({
      id: p.id || p.firebase_uid,
      firebase_uid: p.firebase_uid || p.id,
      display_name: p.display_name || p.first_name || 'User',
      first_name: p.first_name || p.display_name || 'User',
      birthday: p.birthday || null,
      gender: p.gender || null,
      location_city: p.location_city || 'India',
      occupation: p.occupation || 'Member',
      education: p.education || '',
      interests: p.interests || [],
      bio: p.bio || '',
      photos: p.photos || [],
      profile_completed: true,
    }));

    res.status(200).json({ profiles: results });
  } catch (err: any) {
    console.error('[Profiles/Search] Error:', err);
    res.status(500).json({ error: 'SEARCH_ERROR' });
  }
});

/**
 * GET /api/profiles/:id
 * Get profile by firebase_uid or id
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
    } catch {
      // Fallback: search by id column if targetId is UUID
      if (isUuid(targetId)) {
        const supabase = getSupabase();
        const { data } = await supabase.from('profiles').select('*').eq('id', targetId).maybeSingle();
        profile = data;
      }
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
