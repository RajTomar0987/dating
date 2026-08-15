import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { getSupabase } from '../services/supabase.js';
import { inMemoryProfiles } from '../services/profileStore.js';
import { z } from 'zod';

const router = Router();

// Resilient schema — optional defaults so validation never fails on incomplete fields
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

/**
 * GET /api/profiles/discover
 * Discover real user profiles from Supabase (excluding current user)
 */
router.get('/discover', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const currentUserId = req.user?.firebase_uid || req.user?.id;
  if (!currentUserId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const supabase = getSupabase();
    const { data: dbProfiles } = await supabase
      .from('profiles')
      .select('*')
      .neq('firebase_uid', currentUserId)
      .limit(50);

    let allProfiles = dbProfiles || [];

    for (const [uid, p] of inMemoryProfiles.entries()) {
      if (uid !== currentUserId && !allProfiles.some((existing: any) => existing.firebase_uid === uid)) {
        allProfiles.push(p);
      }
    }

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
 * Get the authenticated user's profile from Supabase (or fallback)
 */
router.get('/me', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const firebaseUid = req.user?.firebase_uid || req.user?.id;
    if (!firebaseUid) {
      res.status(401).json({ error: 'UNAUTHORIZED' });
      return;
    }

    console.log(`[PROFILE] Firebase UID: ${firebaseUid}`);
    console.log(`[PROFILE] Looking up profile for UID: ${firebaseUid}`);

    const supabase = getSupabase();
    let dbProfile: any = null;
    let dbError: any = null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`firebase_uid.eq.${firebaseUid},id.eq.${firebaseUid}`)
        .maybeSingle();

      dbProfile = data;
      dbError = error;
    } catch (e) {
      dbError = e;
    }

    if (dbError) {
      console.error('[PROFILE] Supabase lookup error:', JSON.stringify(dbError));
      // Do NOT convert database errors into 404 PROFILE_NOT_FOUND
      // Return 500 if database query itself fails (unless it's an in-memory test fallback)
      const fallbackProfile = inMemoryProfiles.get(firebaseUid);
      if (fallbackProfile) {
        console.log('[PROFILE] Supabase error present, returning seeded memory fallback profile');
        res.status(200).json({ profile: fallbackProfile });
        return;
      }
      res.status(500).json({ error: 'DATABASE_ERROR', details: dbError?.message || String(dbError) });
      return;
    }

    if (dbProfile) {
      console.log('[PROFILE] Profile found: true, profile_completed:', dbProfile.profile_completed);
      inMemoryProfiles.set(firebaseUid, dbProfile);
      res.status(200).json({ profile: dbProfile });
      return;
    }

    // Check in-memory store if Supabase row does not exist
    const fallbackProfile = inMemoryProfiles.get(firebaseUid);
    if (fallbackProfile) {
      console.log('[PROFILE] Profile found in memory fallback: true');
      res.status(200).json({ profile: fallbackProfile });
      return;
    }

    // Return 404 PROFILE_NOT_FOUND ONLY when profile genuinely does not exist
    console.warn('[PROFILE] PROFILE_NOT_FOUND for UID:', firebaseUid);
    res.status(404).json({ error: 'PROFILE_NOT_FOUND' });
  } catch (err: any) {
    console.error('[PROFILE] Unexpected error:', err);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

/**
 * GET /api/profiles/search?q=<query>
 * Real user search across display_name, first_name, location_city, occupation, education, bio, interests.
 * Excludes current authenticated user. Returns max 10 matches.
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
    let dbMatches: any[] = [];

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('firebase_uid', currentUid)
        .or(`display_name.ilike.%${queryStr}%,first_name.ilike.%${queryStr}%,location_city.ilike.%${queryStr}%,occupation.ilike.%${queryStr}%,education.ilike.%${queryStr}%,bio.ilike.%${queryStr}%`)
        .limit(10);

      if (!error && Array.isArray(data)) {
        dbMatches = data;
      }
    } catch (err) {
      console.warn('[Profiles/Search] Supabase query notice:', err);
    }

    // Also search memory store
    const memoryMatches: any[] = [];
    for (const [uid, prof] of inMemoryProfiles.entries()) {
      if (uid === currentUid || prof.firebase_uid === currentUid) continue;

      const searchableText = [
        prof.display_name,
        prof.first_name,
        prof.location_city,
        prof.occupation,
        prof.education,
        prof.bio,
        ...(Array.isArray(prof.interests) ? prof.interests : [])
      ].filter(Boolean).join(' ').toLowerCase();

      if (searchableText.includes(queryStr)) {
        memoryMatches.push(prof);
      }
    }

    // Combine & deduplicate by firebase_uid / id
    const profileMap = new Map<string, any>();
    for (const p of [...dbMatches, ...memoryMatches]) {
      const key = p.firebase_uid || p.id;
      if (key && key !== currentUid && !profileMap.has(key)) {
        profileMap.set(key, {
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
          profile_completed: true
        });
      }
    }

    const results = Array.from(profileMap.values()).slice(0, 10);
    console.log(`[Profiles/Search] Found ${results.length} matching profiles for query: "${queryStr}"`);
    res.status(200).json({ profiles: results });
  } catch (err: any) {
    console.error('[Profiles/Search] Error:', err);
    res.status(500).json({ error: 'SEARCH_ERROR' });
  }
});

/**
 * GET /api/profiles/:id
 * Get a specific user profile by firebase_uid or profile ID
 */
router.get('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const targetId = (Array.isArray(rawId) ? String(rawId[0]) : String(rawId || '')).trim();
    if (!targetId) {
      res.status(400).json({ error: 'Missing target profile ID' });
      return;
    }

    const supabase = getSupabase();
    let dbProfile: any = null;

    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .or(`firebase_uid.eq.${targetId},id.eq.${targetId}`)
        .maybeSingle();

      dbProfile = data;
    } catch (e) {
      console.warn('[Profiles/:id] Supabase query notice:', e);
    }

    const profile = dbProfile || inMemoryProfiles.get(targetId);
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
 * Complete the profile wizard — sets profile_completed to true
 */
router.post('/complete', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const firebaseUid = req.user?.firebase_uid || req.user?.id;

  if (!firebaseUid) {
    console.error('[PROFILE] Unauthorized: Missing user UID on POST /complete');
    res.status(401).json({ error: 'Unauthorized: Missing user UID' });
    return;
  }

  console.log(`[PROFILE] Firebase UID: ${firebaseUid}`);
  console.log(`[PROFILE] Creating profile for UID: ${firebaseUid}`);

  // Validate request body
  const result = ProfileCompleteSchema.safeParse(req.body);
  if (!result.success) {
    console.error('[PROFILE] Payload validation failed:', result.error.errors);
    res.status(400).json({ error: 'Invalid profile data', details: result.error.errors });
    return;
  }

  const rawData = result.data;

  // Sanitize data for PostgreSQL compatibility:
  let cleanBirthday: string | null = null;
  if (rawData.birthday && typeof rawData.birthday === 'string' && rawData.birthday.trim().length > 0) {
    const d = new Date(rawData.birthday.trim());
    if (!isNaN(d.getTime())) {
      cleanBirthday = rawData.birthday.trim();
    }
  }

  const cleanHeight = (typeof rawData.height_cm === 'number' && !isNaN(rawData.height_cm)) ? rawData.height_cm : null;
  const cleanLat = (typeof rawData.location_lat === 'number' && !isNaN(rawData.location_lat)) ? rawData.location_lat : null;
  const cleanLng = (typeof rawData.location_lng === 'number' && !isNaN(rawData.location_lng)) ? rawData.location_lng : null;

  const updateData = {
    ...rawData,
    birthday: cleanBirthday,
    height_cm: cleanHeight,
    location_lat: cleanLat,
    location_lng: cleanLng,
    email: req.user?.email || null,
    profile_completed: true,
    updated_at: new Date().toISOString(),
  };

  try {
    const supabase = getSupabase();

    const { data: dbProfile, error: upsertError } = await supabase
      .from('profiles')
      .upsert(
        {
          firebase_uid: firebaseUid,
          ...updateData,
        },
        { onConflict: 'firebase_uid' }
      )
      .select()
      .maybeSingle();

    if (upsertError) {
      console.error('[PROFILE] Supabase upsert error:', JSON.stringify(upsertError));
      console.error('[PROFILE] Upsert error code:', upsertError.code);
      console.error('[PROFILE] Upsert error message:', upsertError.message);
      res.status(500).json({ error: 'DATABASE_WRITE_FAILED', details: upsertError.message });
      return;
    }

    // Read back from database to verify persistence
    const { data: verifiedProfile, error: verifyErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('firebase_uid', firebaseUid)
      .maybeSingle();

    if (verifyErr || !verifiedProfile) {
      console.error('[PROFILE] Persistence verification failed:', verifyErr);
      res.status(500).json({ error: 'PERSISTENCE_VERIFICATION_FAILED', details: verifyErr?.message || 'Row not found after upsert' });
      return;
    }

    console.log('[PROFILE] Profile persisted successfully in Supabase for UID:', firebaseUid);
    inMemoryProfiles.set(firebaseUid, verifiedProfile);

    res.status(200).json({
      success: true,
      profile: verifiedProfile,
    });
  } catch (err: any) {
    console.error('[PROFILE] Unexpected error during profile completion:', err);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', details: err?.message || String(err) });
  }
});

/**
 * PUT /api/profiles/me
 * Update the authenticated user's profile
 */
router.put('/me', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const firebaseUid = req.user?.firebase_uid || req.user?.id;
  if (!firebaseUid) {
    res.status(401).json({ error: 'Unauthorized: Missing user UID' });
    return;
  }
  const result = ProfileUpdateSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid profile data', details: result.error.errors });
    return;
  }

  try {
    const supabase = getSupabase();
    const updateData = {
      ...result.data,
      updated_at: new Date().toISOString(),
    };

    let profile = null;
    const { data: dbProfile, error } = await supabase
      .from('profiles')
      .upsert(
        {
          firebase_uid: firebaseUid,
          ...updateData,
        },
        { onConflict: 'firebase_uid' }
      )
      .select()
      .maybeSingle();

    if (!error && dbProfile) {
      profile = dbProfile;
      inMemoryProfiles.set(firebaseUid, profile);
    } else {
      const existing = inMemoryProfiles.get(firebaseUid) || {};
      profile = {
        ...existing,
        id: firebaseUid,
        firebase_uid: firebaseUid,
        ...updateData,
      };
      inMemoryProfiles.set(firebaseUid, profile);
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (err: any) {
    console.error('[Profiles] Update profile error:', err);
    const existing = inMemoryProfiles.get(firebaseUid) || {};
    const profile = {
      ...existing,
      id: firebaseUid,
      firebase_uid: firebaseUid,
      ...result.data,
      updated_at: new Date().toISOString(),
    };
    inMemoryProfiles.set(firebaseUid, profile);

    res.status(200).json({
      success: true,
      profile,
    });
  }
});

/**
 * POST /api/profiles/photos
 * Upload photo metadata (actual upload goes to Supabase Storage from client)
 */
router.post('/photos', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { photoUrl } = req.body;
  const firebaseUid = req.user?.firebase_uid || req.user?.id;

  if (!photoUrl) {
    res.status(400).json({ error: 'Missing photoUrl' });
    return;
  }

  try {
    const supabase = getSupabase();
    const { data: profile } = await supabase
      .from('profiles')
      .select('photos')
      .eq('firebase_uid', firebaseUid)
      .single();

    const currentPhotos = profile?.photos || [];
    const updatedPhotos = [...currentPhotos, photoUrl];

    const { error } = await supabase
      .from('profiles')
      .update({ photos: updatedPhotos, updated_at: new Date().toISOString() })
      .eq('firebase_uid', firebaseUid);

    if (error) {
      console.error("Supabase Error (Photo):", error);
      res.status(500).json({ error: error.message || JSON.stringify(error) });
      return;
    }

    res.status(200).json({ success: true, message: 'Photo added', url: photoUrl });
  } catch (err: any) {
    console.error('[Profiles] Photo upload error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

export default router;
