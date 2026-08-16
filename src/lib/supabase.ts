import { createClient } from '@supabase/supabase-js';

const PRODUCTION_SUPABASE_URL = 'https://cspcrxztpuaofwtophik.supabase.co';
const PRODUCTION_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzcGNyeHp0cHVhb2Z3dG9waGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwOTc0NTcsImV4cCI6MjEwMTY3MzQ1N30.hfrDRpGdn_I3zmMV6HTKDMZwbhPamMvt-cT1n_2uA0s';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || PRODUCTION_SUPABASE_URL;
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || PRODUCTION_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
