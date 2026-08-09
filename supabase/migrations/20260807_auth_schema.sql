-- Migration: Create profiles table with Firebase Auth integration
-- Run this against your Supabase instance

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  auth_provider TEXT DEFAULT 'unknown',
  display_name TEXT,
  first_name TEXT,
  birthday DATE,
  gender TEXT,
  interested_in TEXT[] DEFAULT '{}',
  height_cm INTEGER,
  education TEXT,
  occupation TEXT,
  languages TEXT[] DEFAULT '{}',
  bio TEXT,
  prompts JSONB,
  interests TEXT[] DEFAULT '{}',
  lifestyle TEXT[] DEFAULT '{}',
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  location_city TEXT,
  photos TEXT[] DEFAULT '{}',
  profile_completed BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on firebase_uid for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_firebase_uid ON profiles(firebase_uid);

-- Create index on location for proximity queries
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location_lat, location_lng);

-- Create index for discovery queries
CREATE INDEX IF NOT EXISTS idx_profiles_discovery ON profiles(profile_completed, gender, is_verified);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read any completed profile (for discovery)
CREATE POLICY "Anyone can view completed profiles"
  ON profiles FOR SELECT
  USING (profile_completed = true);

-- Policy: Users can update their own profile (matched by service role from backend)
CREATE POLICY "Service role full access"
  ON profiles FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for profile photos (run in Supabase Dashboard > Storage)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
