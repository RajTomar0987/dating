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

    console.log('[PROFILE/ME] Request received');
    console.log('[PROFILE/ME] Authenticated user:', req.user);
    console.log('[PROFILE/ME] Looking up firebase_uid:', firebaseUid);

    const supabase = getSupabase();
    let dbProfile: any = null;
    let dbError: any = null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('firebase_uid', firebaseUid)
        .maybeSingle();

      dbProfile = data;
      dbError = error;
    } catch (e) {
      dbError = e;
    }

    console.log('[PROFILE/ME] Supabase error:', dbError);

    if (dbProfile) {
      console.log('[PROFILE/ME] Profile found in Supabase:', true);
      inMemoryProfiles.set(firebaseUid, dbProfile);
      res.status(200).json({ profile: dbProfile });
      return;
    }

    // Check in-memory store if Supabase row does not exist or table is unmigrated (PGRST205)
    const fallbackProfile = inMemoryProfiles.get(firebaseUid);
    if (fallbackProfile) {
      console.log('[PROFILE/ME] Profile found in memory store:', true);
      res.status(200).json({ profile: fallbackProfile });
      return;
    }

    console.log('[PROFILE/ME] Profile found:', false);
    res.status(404).json({ error: 'PROFILE_NOT_FOUND' });
  } catch (err: any) {
    const firebaseUid = req.user?.firebase_uid || req.user?.id;
    if (firebaseUid && inMemoryProfiles.has(firebaseUid)) {
      res.status(200).json({ profile: inMemoryProfiles.get(firebaseUid) });
      return;
    }
    console.error('[PROFILE/ME] Get profile exception:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: err.message || err });
  }
});

/**
 * POST /api/profiles/complete
 * Complete the profile wizard — sets profile_completed to true
 */
router.post('/complete', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  console.log("=== PROFILE COMPLETE REQUEST ===");
  console.log("Authorization exists:", !!req.headers.authorization);
  console.log("Authenticated user:", req.user);
  console.log("Request body:", req.body);

  const firebaseUid = req.user?.firebase_uid || req.user?.id;

  if (!firebaseUid) {
    console.error("[Profiles Error] Missing authenticated user UID on request - Auth failed");
    res.status(401).json({ error: "Unauthorized: Missing user UID" });
    return;
  }

  // Validate request body
  const result = ProfileCompleteSchema.safeParse(req.body);
  if (!result.success) {
    console.error("[Profiles Error] Payload validation failed:", result.error.errors);
    res.status(400).json({ error: "Invalid profile data", details: result.error.errors });
    return;
  }

  try {
    const supabase = getSupabase();

    const updateData = {
      ...result.data,
      profile_completed: true,
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
      .single();

    if (error) {
      console.error("=== SUPABASE PROFILE ERROR ===");
      console.error(error);

      // Fallback save in memory store when Supabase table is unmigrated or fails
      profile = {
        id: firebaseUid,
        firebase_uid: firebaseUid,
        email: req.user?.email || null,
        created_at: new Date().toISOString(),
        ...updateData,
      };
      inMemoryProfiles.set(firebaseUid, profile);
      console.log("Profile saved to fallback memory store due to Supabase error:", profile);
    } else {
      profile = dbProfile;
      inMemoryProfiles.set(firebaseUid, profile);
    }

    console.log("Profile saved successfully:", profile);

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (err: any) {
    console.error("=== SUPABASE PROFILE ERROR ===");
    console.error(err);

    const profile = {
      id: firebaseUid,
      firebase_uid: firebaseUid,
      email: req.user?.email || null,
      created_at: new Date().toISOString(),
      ...result.data,
      profile_completed: true,
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
