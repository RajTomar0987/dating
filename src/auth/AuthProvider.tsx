import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  type ConfirmationResult,
} from '../lib/firebase';
import { AuthContext, type AuthStatus, type UserProfile } from './AuthContext';
import { useAppStore } from '../store/useAppStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [jwt, setJwt] = useState<string | null>(() => localStorage.getItem('aura_jwt_token'));
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Create session with backend — exchange Firebase token for JWT + profile
  const createSession = useCallback(async (user: User): Promise<{ jwt: string; profile: UserProfile | null }> => {
    const idToken = await user.getIdToken(true);
    console.log("Firebase User:", user);
    console.log("Firebase ID Token:", idToken);

    const res = await fetch(`${API_BASE_URL}/auth/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    console.log("Session Status:", res.status);

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({ error: 'Session creation failed' }));
      console.error("[AuthProvider] Session creation response error:", errBody);
      throw new Error(errBody.error || 'Session creation failed');
    }

    const data = await res.json();
    console.log("Backend JWT:", data.token);
    return { jwt: data.token, profile: data.profile };
  }, []);

  // Establish session after Firebase auth
  const establishSession = useCallback(async (user: User) => {
    try {
      setProfileLoading(true);
      setError(null);

      const { jwt: token, profile: userProfile } = await createSession(user);

      setJwt(token);
      localStorage.setItem('aura_jwt_token', token);

      if (userProfile && userProfile.profile_completed) {
        setProfile(userProfile);
        setStatus('authenticated');
      } else {
        setProfile(userProfile);
        setStatus('needs-profile');
      }
    } catch (err: any) {
      console.error('[AuthProvider] Session creation failed:', err);
      setError(err.message || 'Failed to create session');
      setStatus('needs-profile');
    } finally {
      setProfileLoading(false);
    }
  }, [createSession]);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user) {
        await establishSession(user);
      } else {
        setProfile(null);
        setJwt(null);
        localStorage.removeItem('aura_jwt_token');
        setStatus('unauthenticated');
      }

      setAuthInitialized(true);
    });

    return () => unsubscribe();
  }, [establishSession]);

  // Multi-tab sync — listen for storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'aura_jwt_token') {
        if (!e.newValue) {
          // Another tab logged out
          setJwt(null);
          setProfile(null);
          setStatus('unauthenticated');
          firebaseSignOut(auth).catch(() => { });
        } else if (e.newValue !== jwt) {
          // Another tab refreshed token
          setJwt(e.newValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [jwt]);

  // Auth actions
  const loginWithEmail = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      const message = getFirebaseErrorMessage(err.code);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const signupWithEmail = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      const message = getFirebaseErrorMessage(err.code);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') return;
      const message = getFirebaseErrorMessage(err.code);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const loginWithPhone = useCallback(async (phoneNumber: string, recaptchaVerifier: any): Promise<ConfirmationResult> => {
    try {
      setError(null);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return confirmationResult;
    } catch (err: any) {
      const message = getFirebaseErrorMessage(err.code);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const verifyPhoneOTP = useCallback(async (confirmationResult: ConfirmationResult, otp: string) => {
    try {
      setError(null);
      await confirmationResult.confirm(otp);
    } catch (err: any) {
      const message = getFirebaseErrorMessage(err.code);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setJwt(null);
      setProfile(null);
      localStorage.removeItem('aura_jwt_token');
      setStatus('unauthenticated');

      // Reset Zustand store
      const resetStore = useAppStore.getState().resetStore;
      if (resetStore) resetStore();
    } catch (err: any) {
      console.error('[AuthProvider] Logout error:', err);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!firebaseUser) return;
    await establishSession(firebaseUser);
  }, [firebaseUser, establishSession]);

  const clearError = useCallback(() => setError(null), []);

  const contextValue = useMemo(() => ({
    firebaseUser,
    profile,
    jwt,
    status: authInitialized ? status : 'loading' as AuthStatus,
    loading: !authInitialized || status === 'loading',
    profileLoading,
    error,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    loginWithPhone,
    verifyPhoneOTP,
    logout,
    refreshProfile,
    setProfile,
    clearError,
  }), [
    firebaseUser, profile, jwt, status, authInitialized, profileLoading, error,
    loginWithEmail, signupWithEmail, loginWithGoogle, loginWithPhone, verifyPhoneOTP,
    logout, refreshProfile, clearError,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Firebase error code to user-friendly message
function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/invalid-phone-number':
      return 'Please enter a valid phone number.';
    case 'auth/invalid-verification-code':
      return 'Invalid verification code. Please try again.';
    case 'auth/popup-blocked':
      return 'Popup was blocked. Please allow popups for this site.';
    default:
      return 'An authentication error occurred. Please try again.';
  }
}
