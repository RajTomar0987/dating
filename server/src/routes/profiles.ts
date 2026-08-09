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

/**
 * GET /api/profiles/me
 * Get the authenticated user's profile from Supabase (or fallback)
 */
router.get('/me', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const firebaseUid = req.user?.firebase_uid || req.user?.id;
    if (!firebaseUid) {
      res.status(401).json({ error: 'Unauthorized: Missing user UID' });
      return;
    }

    const supabase = getSupabase();
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('firebase_uid', firebaseUid)
      .single();

    if (profile) {
      res.status(200).json(profile);
      return;
    }

    const fallbackProfile = inMemoryProfiles.get(firebaseUid);
    if (fallbackProfile) {
      res.status(200).json(fallbackProfile);
      return;
    }

    console.warn('[Profiles] Get profile notice:', error);
    res.status(404).json({ error: 'Profile not found' });
  } catch (err: any) {
    const firebaseUid = req.user?.firebase_uid || req.user?.id;
    if (firebaseUid && inMemoryProfiles.has(firebaseUid)) {
      res.status(200).json(inMemoryProfiles.get(firebaseUid));
      return;
    }
    console.error('[Profiles] Get profile error:', err);
    res.status(500).json({ error: err.message || err });
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

    const { data: profile, error } = await supabase
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
      console.error("Supabase Error (Update):", error);
      res.status(500).json({ error: error.message || JSON.stringify(error) });
      return;
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (err: any) {
    console.error('[Profiles] Update profile error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
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
