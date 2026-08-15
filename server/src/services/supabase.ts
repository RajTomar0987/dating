import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded from both current directory and parent workspace root
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

let client: any = null;

const DEFAULT_SUPABASE_URL = 'https://cspcrxztpuaofwtophik.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzcGNyeHp0cHVhb2Z3dG9waGlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjA5NzQ1NywiZXhwIjoyMTAxNjczNDU3fQ.pInwyql4SD-yiLnr6w1n2FORDt615ewRW5XChXdTTHo';

/**
 * Decode the "role" claim from a Supabase JWT (anon vs service_role).
 * Returns the role string or 'unknown' if decoding fails.
 */
function decodeSupabaseKeyRole(jwtKey: string): string {
  try {
    const parts = jwtKey.split('.');
    if (parts.length !== 3) return 'unknown';
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload.role || 'unknown';
  } catch {
    return 'unknown';
  }
}

export function getSupabase() {
  if (!client) {
    const rawUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
    const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
    
    // CRITICAL: The backend MUST use the service_role key to bypass RLS.
    // The anon key respects RLS policies, which block INSERT/UPDATE on profiles
    // and only allow SELECT where profile_completed = true.
    // This causes profile upserts to silently fail and GET /me to return 404.
    //
    // Priority order — prefer service_role keys, then fall back with warnings:
    // 1. SUPABASE_SERVICE_ROLE_KEY (correct — bypasses RLS)
    // 2. SUPABASE_KEY / SUPABASE_SECRET_KEY (may be service_role)
    // 3. DEFAULT_SUPABASE_KEY (hardcoded service_role fallback)
    // 4. SUPABASE_ANON_KEY / VITE_SUPABASE_ANON_KEY (WRONG — will cause profile persistence failures)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const otherKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SECRET_KEY;
    const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    let key: string;
    let keySource: string;

    if (serviceRoleKey) {
      key = serviceRoleKey.trim();
      keySource = 'SUPABASE_SERVICE_ROLE_KEY';
    } else if (otherKey) {
      key = otherKey.trim();
      keySource = process.env.SUPABASE_KEY ? 'SUPABASE_KEY' : 'SUPABASE_SECRET_KEY';
    } else if (anonKey) {
      key = anonKey.trim();
      keySource = process.env.SUPABASE_ANON_KEY ? 'SUPABASE_ANON_KEY' : 'VITE_SUPABASE_ANON_KEY';
    } else {
      key = DEFAULT_SUPABASE_KEY;
      keySource = 'DEFAULT_SUPABASE_KEY (hardcoded)';
    }

    const role = decodeSupabaseKeyRole(key);

    console.log('[SUPABASE DIAGNOSTICS] Supabase URL configured:', Boolean(cleanUrl));
    console.log('[SUPABASE DIAGNOSTICS] Supabase key source:', keySource);
    console.log('[SUPABASE DIAGNOSTICS] Supabase key role:', role);
    console.log('[SUPABASE DIAGNOSTICS] Supabase key length:', key.length);

    if (role === 'anon') {
      console.error('🚨🚨🚨 [SUPABASE CRITICAL] Backend is using the ANON key! This will cause:');
      console.error('   - Profile INSERT/UPDATE silently blocked by RLS');
      console.error('   - GET /api/profiles/me returns 404 for profiles with profile_completed=false');
      console.error('   - Users stuck in infinite onboarding loop');
      console.error('   FIX: Set SUPABASE_SERVICE_ROLE_KEY in your Render environment variables');
    } else if (role === 'service_role') {
      console.log('✅ [SUPABASE] Using service_role key — RLS bypassed (correct for backend)');
    }

    console.log('⚡ Initializing Supabase Backend Client with URL:', cleanUrl);

    client = createClient(cleanUrl, key);
  }
  return client;
}

