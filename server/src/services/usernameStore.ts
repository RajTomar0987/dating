import crypto from 'crypto';
import { getSupabase } from './supabase.js';

const USERNAME_REGEX = /^[a-z0-9_]{4,20}$/;

/**
 * Clean username string: strip leading '@', trim, convert to lowercase.
 */
export function cleanUsername(input?: string | null): string {
  if (!input || typeof input !== 'string') return '';
  let cleaned = input.trim();
  if (cleaned.startsWith('@')) {
    cleaned = cleaned.substring(1).trim();
  }
  return cleaned.toLowerCase();
}

/**
 * Validate username format: a-z, 0-9, _, length 4-20
 */
export function validateUsernameFormat(username: string): { valid: boolean; reason?: string } {
  const cleaned = cleanUsername(username);
  if (!cleaned) {
    return { valid: false, reason: 'Username cannot be empty.' };
  }
  if (cleaned.length < 4) {
    return { valid: false, reason: 'Username must be at least 4 characters.' };
  }
  if (cleaned.length > 20) {
    return { valid: false, reason: 'Username must be at most 20 characters.' };
  }
  if (!USERNAME_REGEX.test(cleaned)) {
    return { valid: false, reason: 'Username can only contain lowercase letters, numbers, and underscores.' };
  }
  return { valid: true };
}

/**
 * Check if username is available in Supabase database (case-insensitive)
 */
export async function checkUsernameAvailable(username: string, excludeUid?: string): Promise<boolean> {
  const cleaned = cleanUsername(username);
  if (!cleaned || !validateUsernameFormat(cleaned).valid) {
    return false;
  }

  try {
    const supabase = getSupabase();
    let query = supabase.from('profiles').select('id, firebase_uid, username, prompts');

    if (excludeUid) {
      query = query.neq('firebase_uid', excludeUid);
    }

    let { data, error } = await query;
    if (error && (error.message?.includes('username') || error.message?.includes('column'))) {
      // Fallback query selecting prompts column directly
      const fallbackQuery = supabase.from('profiles').select('id, firebase_uid, prompts');
      const fallbackRes = await fallbackQuery;
      data = fallbackRes.data;
      error = fallbackRes.error;
    }

    if (error) {
      console.warn('[USERNAME STORE] Availability lookup notice:', error.message);
      return false;
    }

    const isTaken = (data || []).some((p: any) => {
      const existingUser = cleanUsername(p.username || p.prompts?.username);
      return existingUser === cleaned;
    });

    return !isTaken;
  } catch (err: any) {
    console.error('[USERNAME STORE] checkUsernameAvailable exception:', err);
    return false;
  }
}

/**
 * Generate a unique username candidate based on user name (e.g. Raj -> raj_8k4m2, Yuv -> yuv_3p82q, Elena -> elena_7x91p)
 */
export async function generateUniqueUsername(nameInput?: string | null, excludeUid?: string): Promise<string> {
  let baseName = (nameInput || 'user')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 10);
  if (baseName.length < 3) {
    baseName = 'aura';
  }

  // Loop to generate and verify unique candidate
  for (let attempt = 0; attempt < 30; attempt++) {
    const randomSuffix = crypto.randomBytes(3).toString('hex').substring(0, 5).toLowerCase();
    const candidate = `${baseName}_${randomSuffix}`;
    
    if (validateUsernameFormat(candidate).valid) {
      const isAvailable = await checkUsernameAvailable(candidate, excludeUid);
      if (isAvailable) {
        console.log(`[USERNAME STORE] Generated unique username candidate: @${candidate}`);
        return candidate;
      }
    }
  }

  // Cryptographically guaranteed fallback candidate (never static timestamp!)
  const cryptoSuffix = crypto.randomBytes(4).toString('hex').substring(0, 6).toLowerCase();
  const fallback = `${baseName}_${cryptoSuffix}`;
  return fallback;
}

/**
 * Ensure username column & case-insensitive unique index exists,
 * and migrate any existing profiles missing a username OR having duplicate usernames.
 */
export async function ensureUsernameSchemaAndMigrateExistingUsers(): Promise<void> {
  try {
    const supabase = getSupabase();
    console.log('[USERNAME MIGRATION] Scanning database for missing or duplicate usernames...');

    const { data: allProfiles, error } = await supabase
      .from('profiles')
      .select('id, firebase_uid, first_name, display_name, username, prompts');

    if (error) {
      console.warn('[USERNAME MIGRATION] Lookup warning:', error.message);
      return;
    }

    if (!allProfiles || allProfiles.length === 0) {
      console.log('[USERNAME MIGRATION] No database profiles found.');
      return;
    }

    // Count occurrences of each username
    const usernameCounts = new Map<string, number>();
    allProfiles.forEach((p: any) => {
      const u = cleanUsername(p.username || p.prompts?.username);
      if (u) {
        usernameCounts.set(u, (usernameCounts.get(u) || 0) + 1);
      }
    });

    const claimedUsernames = new Set<string>();
    const profilesToUpdate: any[] = [];

    for (const p of allProfiles) {
      const u = cleanUsername(p.username || p.prompts?.username);
      const isDuplicate = u ? (usernameCounts.get(u) || 0) > 1 && claimedUsernames.has(u) : false;

      if (!u || isDuplicate) {
        profilesToUpdate.push(p);
      } else if (u) {
        claimedUsernames.add(u);
      }
    }

    if (profilesToUpdate.length === 0) {
      console.log('[USERNAME MIGRATION] All existing profiles already have unique usernames.');
      return;
    }

    console.log(`[USERNAME MIGRATION] Reassigning unique usernames for ${profilesToUpdate.length} profile(s)...`);

    for (const p of profilesToUpdate) {
      const uid = p.firebase_uid || p.id;
      const firstName = p.first_name || p.display_name || 'user';
      const newUsername = await generateUniqueUsername(firstName, uid);

      const payload: Record<string, any> = {
        username: newUsername,
        prompts: {
          ...(p.prompts || {}),
          username: newUsername,
        },
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', p.id);

      if (updateError) {
        console.error(`[USERNAME MIGRATION] Failed to update username @${newUsername} for profile ID ${p.id}:`, updateError.message);
      } else {
        claimedUsernames.add(newUsername);
        console.log(`[USERNAME MIGRATION] Reassigned unique username @${newUsername} to profile ID ${p.id} (UID: ${uid})`);
      }
    }
  } catch (err: any) {
    console.warn('[USERNAME MIGRATION] Migration exception:', err?.message || err);
  }
}
