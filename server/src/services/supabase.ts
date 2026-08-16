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
    // Priority order — service_role keys first:
    // 1. SUPABASE_SERVICE_ROLE_KEY (user-configured on Render/local)
    // 2. SUPABASE_KEY / SUPABASE_SECRET_KEY
    // 3. DEFAULT_SUPABASE_KEY (hardcoded service_role fallback)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const otherKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SECRET_KEY;

    let key: string;
    let keySource: string;

    if (serviceRoleKey && serviceRoleKey.trim().length > 0) {
      key = serviceRoleKey.trim();
      keySource = 'SUPABASE_SERVICE_ROLE_KEY';
    } else if (otherKey && otherKey.trim().length > 0) {
      key = otherKey.trim();
      keySource = process.env.SUPABASE_KEY ? 'SUPABASE_KEY' : 'SUPABASE_SECRET_KEY';
    } else {
      key = DEFAULT_SUPABASE_KEY;
      keySource = 'DEFAULT_SUPABASE_KEY (hardcoded service_role fallback)';
    }

    const role = decodeSupabaseKeyRole(key);

    console.log('[SUPABASE DIAGNOSTICS] Supabase URL configured:', Boolean(cleanUrl));
    console.log('[SUPABASE DIAGNOSTICS] Supabase key source:', keySource);
    console.log('[SUPABASE DIAGNOSTICS] Supabase key role:', role);
    console.log('[SUPABASE DIAGNOSTICS] Supabase key length:', key.length);

    // Additional safe diagnostics requested for production troubleshooting
    const serviceRoleConfigured = Boolean(serviceRoleKey && serviceRoleKey.trim().length > 0);
    console.log('[SUPABASE] URL configured:', Boolean(cleanUrl));
    console.log('[SUPABASE] Service role key configured:', serviceRoleConfigured);
    try {
      const parsed = new URL(cleanUrl);
      console.log('[SUPABASE] Project/reference:', parsed.hostname);
    } catch (e) {
      // Fallback: print a safe identifier (host without path)
      const hostLike = String(cleanUrl).replace(/^https?:\/\//, '').replace(/\/.*/, '');
      console.log('[SUPABASE] Project/reference:', hostLike);
    }

    if (role === 'service_role') {
      console.log('✅ [SUPABASE] Using service_role key — RLS bypassed (correct for backend)');
    } else {
      console.warn('⚠️ [SUPABASE] Key role is:', role);
    }

    console.log('⚡ Initializing Supabase Backend Client with URL:', cleanUrl);

    client = createClient(cleanUrl, key);
  }
  return client;
}

