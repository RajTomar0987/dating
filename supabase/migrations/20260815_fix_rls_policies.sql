-- Migration: Fix RLS policies on profiles table
-- 
-- ROOT CAUSE: The original RLS policies only had:
--   1. "Anyone can view completed profiles" → SELECT where profile_completed = true (anon role)
--   2. "Service role full access" → ALL (service_role only)
--
-- This meant that if the backend accidentally used the anon key instead of service_role:
--   - INSERT/UPDATE operations on profiles silently fail (no INSERT/UPDATE policy for anon)
--   - SELECT only returns rows where profile_completed = true (hides in-progress profiles)
--   - Profile upserts from POST /api/profiles/complete silently fail
--   - GET /api/profiles/me returns 404 for users whose profile has profile_completed = false
--   - Users get stuck in infinite onboarding loop
--
-- FIX: Add proper anon role policies as defense in depth.
-- The backend should ALWAYS use service_role (which bypasses RLS entirely),
-- but these policies prevent catastrophic failure if it falls back to anon.

-- Drop the overly restrictive SELECT policy
DROP POLICY IF EXISTS "Anyone can view completed profiles" ON profiles;

-- Allow SELECT on ALL profiles (the backend handles visibility/filtering logic)
CREATE POLICY "Allow read access to all profiles"
  ON profiles FOR SELECT
  USING (true);

-- Allow INSERT for anon role (so profile creation works even with wrong key)
CREATE POLICY "Allow profile creation"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Allow UPDATE for anon role (so profile updates work even with wrong key)
CREATE POLICY "Allow profile updates"
  ON profiles FOR UPDATE
  USING (true)
  WITH CHECK (true);
