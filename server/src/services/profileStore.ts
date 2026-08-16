import { getSupabase } from './supabase.js';
import { cleanUsername, generateUniqueUsername, validateUsernameFormat } from './usernameStore.js';

export interface ProfileData {
  username?: string;
  first_name?: string;
  display_name?: string;
  birthday?: string | null;
  gender?: string;
  interested_in?: string[];
  height_cm?: number | null;
  education?: string | null;
  occupation?: string | null;
  languages?: string[];
  bio?: string;
  prompts?: Record<string, string> | null;
  interests?: string[];
  lifestyle?: string[];
  location_lat?: number | null;
  location_lng?: number | null;
  location_city?: string | null;
  photos?: string[];
  profile_completed?: boolean;
  email?: string | null;
  [key: string]: any;
}

/**
 * Log safe profile diagnostic metrics without exposing sensitive tokens or keys.
 */
function logProfileDebug(metrics: {
  firebaseUidExists: boolean;
  firebaseUidLength: number;
  profileLookupUidExists: boolean;
  profileWriteUidExists: boolean;
  profileFound: boolean;
}) {
  console.log('PROFILE DEBUG:');
  console.log(`firebaseUidExists=${metrics.firebaseUidExists}`);
  console.log(`firebaseUidLength=${metrics.firebaseUidLength}`);
  console.log(`profileLookupUidExists=${metrics.profileLookupUidExists}`);
  console.log(`profileWriteUidExists=${metrics.profileWriteUidExists}`);
  console.log(`profileFound=${metrics.profileFound}`);
}

/**
 * Sanitize and normalize profile payload for PostgreSQL compatibility.
 */
export function normalizeProfileData(data: ProfileData): Record<string, any> {
  const cleanData: Record<string, any> = { ...data };

  // Birthday sanitization (ensure valid YYYY-MM-DD or null for Postgres DATE)
  if (cleanData.birthday && typeof cleanData.birthday === 'string' && cleanData.birthday.trim().length > 0) {
    const parsedDate = new Date(cleanData.birthday.trim());
    if (!isNaN(parsedDate.getTime())) {
      cleanData.birthday = cleanData.birthday.trim();
    } else {
      cleanData.birthday = null;
    }
  } else {
    cleanData.birthday = null;
  }

  // Numeric fields
  cleanData.height_cm = (typeof cleanData.height_cm === 'number' && !isNaN(cleanData.height_cm)) ? cleanData.height_cm : null;
  cleanData.location_lat = (typeof cleanData.location_lat === 'number' && !isNaN(cleanData.location_lat)) ? cleanData.location_lat : null;
  cleanData.location_lng = (typeof cleanData.location_lng === 'number' && !isNaN(cleanData.location_lng)) ? cleanData.location_lng : null;

  // Array fields
  cleanData.interested_in = Array.isArray(cleanData.interested_in) ? cleanData.interested_in : [];
  cleanData.languages = Array.isArray(cleanData.languages) ? cleanData.languages : [];
  cleanData.interests = Array.isArray(cleanData.interests) ? cleanData.interests : [];
  cleanData.lifestyle = Array.isArray(cleanData.lifestyle) ? cleanData.lifestyle : [];
  cleanData.photos = Array.isArray(cleanData.photos)
    ? cleanData.photos.filter((url: any) => typeof url === 'string' && url.trim().length > 0 && !url.trim().startsWith('blob:'))
    : [];

  // Strings
  cleanData.first_name = cleanData.first_name || '';
  cleanData.display_name = cleanData.display_name || cleanData.first_name || '';
  cleanData.bio = cleanData.bio || '';
  cleanData.education = cleanData.education || null;
  cleanData.occupation = cleanData.occupation || null;
  cleanData.location_city = cleanData.location_city || null;
  cleanData.prompts = (cleanData.prompts && typeof cleanData.prompts === 'object') ? cleanData.prompts : null;
  cleanData.profile_completed = cleanData.profile_completed !== undefined ? Boolean(cleanData.profile_completed) : true;
  cleanData.updated_at = new Date().toISOString();

  return cleanData;
}

/**
 * Retrieve profile by authenticated Firebase UID from Supabase.
 * Returns null if profile genuinely does not exist.
 * Throws error if Supabase query fails.
 */
export async function getProfileByFirebaseUid(firebaseUid: string): Promise<any | null> {
  if (!firebaseUid) {
    throw new Error('MISSING_FIREBASE_UID');
  }

  logProfileDebug({
    firebaseUidExists: true,
    firebaseUidLength: firebaseUid.length,
    profileLookupUidExists: true,
    profileWriteUidExists: false,
    profileFound: false,
  });

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('firebase_uid', firebaseUid)
    .maybeSingle();

  if (error) {
    console.error('[profileStore] getProfileByFirebaseUid Supabase error:', error.message || error);
    throw new Error(`DATABASE_QUERY_ERROR: ${error.message || JSON.stringify(error)}`);
  }

  if (data && !data.username && data.prompts?.username) {
    data.username = data.prompts.username;
  }

  logProfileDebug({
    firebaseUidExists: true,
    firebaseUidLength: firebaseUid.length,
    profileLookupUidExists: true,
    profileWriteUidExists: false,
    profileFound: Boolean(data),
  });

  return data;
}

/**
 * Create or update (upsert) profile in Supabase using canonical Firebase UID.
 * Throws error if database write fails or verification fails.
 */
export async function createOrUpdateProfile(firebaseUid: string, profileData: ProfileData): Promise<any> {
  if (!firebaseUid) {
    throw new Error('MISSING_FIREBASE_UID');
  }

  logProfileDebug({
    firebaseUidExists: true,
    firebaseUidLength: firebaseUid.length,
    profileLookupUidExists: false,
    profileWriteUidExists: true,
    profileFound: false,
  });

  const normalized = normalizeProfileData(profileData);
  let finalUsername = cleanUsername(profileData.username);

  if (!finalUsername || !validateUsernameFormat(finalUsername).valid) {
    const existing = await getProfileByFirebaseUid(firebaseUid).catch(() => null);
    if (existing && existing.username && !existing.username.includes('msvu')) {
      finalUsername = cleanUsername(existing.username);
    } else {
      const nameInput = profileData.first_name || profileData.display_name || existing?.first_name || existing?.display_name || 'user';
      finalUsername = await generateUniqueUsername(nameInput, firebaseUid);
    }
  }

  const isUuid = (str: any) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

  const payload: Record<string, any> = {
    firebase_uid: String(firebaseUid),
    ...normalized,
    username: finalUsername,
    prompts: {
      ...(normalized.prompts || {}),
      username: finalUsername,
    },
  };

  if (payload.id && !isUuid(payload.id)) {
    delete payload.id;
  }

  const supabase = getSupabase();

  let { error: upsertError } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'firebase_uid' });

  if (upsertError && (upsertError.message?.includes("'username' column") || upsertError.message?.includes("column \"username\""))) {
    console.warn('[profileStore] Supabase schema cache notice for username column. Storing in metadata...');
    const fallbackPayload: Record<string, any> = { ...payload };
    delete fallbackPayload.username;
    fallbackPayload.prompts = {
      ...(fallbackPayload.prompts || {}),
      username: finalUsername,
    };
    const retry = await supabase.from('profiles').upsert(fallbackPayload, { onConflict: 'firebase_uid' });
    upsertError = retry.error;
  }

  if (upsertError) {
    console.error('[profileStore] createOrUpdateProfile Supabase write error:', upsertError.message || upsertError);
    throw new Error(`PROFILE_SAVE_FAILED: ${upsertError.message || JSON.stringify(upsertError)}`);
  }

  // Mandatory readback verification
  const { data: verifiedProfile, error: verifyError } = await supabase
    .from('profiles')
    .select('*')
    .eq('firebase_uid', firebaseUid)
    .maybeSingle();

  if (verifyError || !verifiedProfile) {
    console.error('[profileStore] Persistence verification failed:', verifyError?.message || 'Row not found after upsert');
    throw new Error(`PERSISTENCE_VERIFICATION_FAILED: ${verifyError?.message || 'Row not found after upsert'}`);
  }

  if (!verifiedProfile.username && verifiedProfile.prompts?.username) {
    verifiedProfile.username = verifiedProfile.prompts.username;
  }

  logProfileDebug({
    firebaseUidExists: true,
    firebaseUidLength: firebaseUid.length,
    profileLookupUidExists: true,
    profileWriteUidExists: true,
    profileFound: true,
  });

  return verifiedProfile;
}

/**
 * Check if a completed profile exists for the given Firebase UID.
 */
export async function profileExists(firebaseUid: string): Promise<boolean> {
  if (!firebaseUid) return false;
  try {
    const profile = await getProfileByFirebaseUid(firebaseUid);
    return Boolean(profile && profile.profile_completed !== false);
  } catch {
    return false;
  }
}
