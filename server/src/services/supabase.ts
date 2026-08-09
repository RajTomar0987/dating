import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded from both current directory and parent workspace root
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

let client: any = null;

export function getSupabase() {
  if (!client) {
    const rawUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://cspcrxztpuaofwtophik.supabase.co';
    const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
    
    console.log('⚡ Initializing Supabase Backend Client with URL:', cleanUrl);
    client = createClient(cleanUrl, key);
  }
  return client;
}
