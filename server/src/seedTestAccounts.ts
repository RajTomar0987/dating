import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config();

import { getSupabase } from './services/supabase.js';
import { inMemoryProfiles } from './services/profileStore.js';

export const TEST_USER_A = {
  id: 'test_user_a_uid',
  firebase_uid: 'test_user_a_uid',
  email: 'testA@auraai.test',
  display_name: 'Test User A',
  first_name: 'Test User A',
  birthday: '2000-01-15',
  gender: 'Male',
  interested_in: ['Women'],
  height_cm: 178,
  education: 'IIT Gwalior',
  occupation: 'Software Engineer',
  languages: ['English', 'Hindi'],
  bio: 'Test account for end-to-end application testing.',
  interests: ['Technology', 'Travel', 'Music', 'Photography'],
  lifestyle: ['Active Lifestyle', 'Early Bird'],
  location_city: 'Gwalior',
  photos: [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  ],
  profile_completed: true
};

export const TEST_USER_B = {
  id: 'test_user_b_uid',
  firebase_uid: 'test_user_b_uid',
  email: 'testB@auraai.test',
  display_name: 'Test User B',
  first_name: 'Test User B',
  birthday: '2001-05-20',
  gender: 'Female',
  interested_in: ['Men'],
  height_cm: 165,
  education: 'Design Institute',
  occupation: 'Designer',
  languages: ['English', 'Hindi'],
  bio: 'Second test account for end-to-end application testing.',
  interests: ['Art', 'Travel', 'Music', 'Movies'],
  lifestyle: ['Creative', 'Social Butterfly'],
  location_city: 'Gwalior',
  photos: [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  ],
  profile_completed: true
};

export async function seedTestAccounts() {
  inMemoryProfiles.set(TEST_USER_A.firebase_uid, TEST_USER_A);
  inMemoryProfiles.set(TEST_USER_B.firebase_uid, TEST_USER_B);

  try {
    const supabase = getSupabase();
    await supabase.from('profiles').upsert([TEST_USER_A, TEST_USER_B], { onConflict: 'firebase_uid' });
    console.log('✅ Test User A and Test User B seeded into Supabase & Memory Store successfully!');
  } catch (err) {
    console.warn('⚠️ Seed warning (using fallback memory store):', err);
  }
}
