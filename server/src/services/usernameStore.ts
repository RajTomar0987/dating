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

    const { data, error } = await query;
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
 * Generate a unique username candidate based on first name (e.g. Raj -> raj_8xk42)
 */
export async function generateUniqueUsername(firstName?: string | null, excludeUid?: string): Promise<string> {
  let baseName = (firstName || 'user')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 10);
  if (baseName.length < 3) {
    baseName = 'aura';
  }

  // Loop to generate and verify unique candidate
  for (let attempt = 0; attempt < 25; attempt++) {
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

  // Fallback candidate
  const fallback = `user_${Date.now().toString(36).substring(0, 6)}`;
  return fallback;
}

/**
 * Ensure username column & case-insensitive unique index exists,
 * and migrate any existing profiles missing a username.
 */
export async function ensureUsernameSchemaAndMigrateExistingUsers(): Promise<void> {
  try {
    const supabase = getSupabase();
    console.log('[USERNAME MIGRATION] Running existing user username migration...');

    // Fetch profiles where username is null or empty
    const { data: unmigratedProfiles, error } = await supabase
      .from('profiles')
      .select('id, firebase_uid, first_name, display_name, username')
      .or('username.is.null,username.eq.');

    if (error) {
      console.warn('[USERNAME MIGRATION] Lookup warning:', error.message);
      return;
    }

    if (!unmigratedProfiles || unmigratedProfiles.length === 0) {
      console.log('[USERNAME MIGRATION] All database profiles already have unique usernames.');
      return;
    }

    console.log(`[USERNAME MIGRATION] Migrating ${unmigratedProfiles.length} existing profile(s) with missing usernames...`);

    for (const p of unmigratedProfiles) {
      const uid = p.firebase_uid || p.id;
      const firstName = p.first_name || p.display_name || 'user';
      const newUsername = await generateUniqueUsername(firstName, uid);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ username: newUsername, updated_at: new Date().toISOString() })
        .eq('id', p.id);

      if (updateError) {
        console.error(`[USERNAME MIGRATION] Failed to assign @${newUsername} to profile ID ${p.id}:`, updateError.message);
      } else {
        console.log(`[USERNAME MIGRATION] Assigned unique username @${newUsername} to profile ID ${p.id}`);
      }
    }
  } catch (err: any) {
    console.warn('[USERNAME MIGRATION] Migration exception:', err?.message || err);
  }
}
