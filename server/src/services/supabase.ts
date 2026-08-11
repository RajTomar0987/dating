import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded from both current directory and parent workspace root
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

let client: any = null;

const DEFAULT_SUPABASE_URL = 'https://cspcrxztpuaofwtophik.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzcGNyeHp0cHVhb2Z3dG9waGlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjA5NzQ1NywiZXhwIjoyMTAxNjczNDU3fQ.pInwyql4SD-yiLnr6w1n2FORDt615ewRW5XChXdTTHo';

export function getSupabase() {
  if (!client) {
    const rawUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
    const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
    
    // Check all potential Supabase environment variable names in order of precedence:
    // 1. SUPABASE_SERVICE_ROLE_KEY
    // 2. SUPABASE_ANON_KEY
    // 3. SUPABASE_KEY
    // 4. SUPABASE_SECRET_KEY
    // 5. VITE_SUPABASE_ANON_KEY
    // 6. DEFAULT_SUPABASE_KEY fallback
    const key = (
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.SUPABASE_KEY ||
      process.env.SUPABASE_SECRET_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      DEFAULT_SUPABASE_KEY
    ).trim();

    const isUrlConfigured = Boolean(cleanUrl);
    const isKeyConfigured = Boolean(key);

    console.log('[SUPABASE DIAGNOSTICS] Supabase URL configured:', isUrlConfigured);
    console.log('[SUPABASE DIAGNOSTICS] Supabase key configured:', isKeyConfigured);
    console.log('[SUPABASE DIAGNOSTICS] Supabase key length:', key ? key.length : 0);
    console.log('⚡ Initializing Supabase Backend Client with URL:', cleanUrl);

    client = createClient(cleanUrl, key);
  }
  return client;
}
