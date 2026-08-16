import { createContext } from 'react';
import type { User } from 'firebase/auth';

export interface UserProfile {
  id: string;
  firebase_uid: string;
  username?: string | null;
  email: string | null;
  phone: string | null;
  auth_provider: string;
  display_name: string | null;
  first_name: string | null;
  birthday: string | null;
  gender: string | null;
  interested_in: string[];
  height_cm: number | null;
  education: string | null;
  occupation: string | null;
  languages: string[];
  bio: string | null;
  prompts: Record<string, string> | null;
  interests: string[];
  lifestyle: string[];
  location_lat: number | null;
  location_lng: number | null;
  location_city: string | null;
  photos: string[];
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

export type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated' | 'needs-profile';

export interface AuthContextType {
  firebaseUser: User | null;
  profile: UserProfile | null;
  jwt: string | null;
  status: AuthStatus;
  loading: boolean;
  profileLoading: boolean;
  error: string | null;

  // Actions
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string) => Promise<void>;
  loginWithCustomToken: (customToken: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithPhone: (phoneNumber: string, recaptchaVerifier: any) => Promise<any>;
  verifyPhoneOTP: (confirmationResult: any, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setProfile: (profile: UserProfile) => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
