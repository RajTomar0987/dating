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

function getApiBaseUrl(): string {
  let url = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (!url) {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      url = 'https://dating-f5pp.onrender.com/api';
    } else {
      url = 'http://localhost:5000/api';
    }
  }
  url = url.trim().replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [jwt, setJwt] = useState<string | null>(() => localStorage.getItem('aura_jwt_token'));
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // 1. Create backend session using Firebase ID token
  const createSession = useCallback(async (user: User): Promise<{ jwt: string; profile: UserProfile | null }> => {
    const idToken = await user.getIdToken(true);
    console.log('[AUTH] Firebase user:', user?.uid);

    const res = await fetch(`${getApiBaseUrl()}/auth/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    console.log('[AUTH] Session response:', res.status);

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({ error: 'Session creation failed' }));
      console.error('[AUTH] Session creation error:', errBody);
      throw new Error(errBody.error || 'Session creation failed');
    }

    const data = await res.json();
    return { jwt: data.token, profile: data.profile };
  }, []);

  // 2. Fetch canonical user profile from GET /api/profiles/me with backend JWT
  const fetchProfileMe = useCallback(async (authToken: string): Promise<{ profile: UserProfile | null; status: number }> => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/profiles/me`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log('[AUTH] Profile response:', res.status);

      if (res.status === 200) {
        const data = await res.json();
        const userProfile = data.profile || data;
        console.log('[AUTH] Profile loaded:', userProfile?.id || userProfile?.firebase_uid);
        return { profile: userProfile, status: 200 };
      }

      if (res.status === 404) {
        console.log('[AUTH] Profile response: 404 (PROFILE_NOT_FOUND)');
        return { profile: null, status: 404 };
      }

      return { profile: null, status: res.status };
    } catch (err) {
      console.error('[AUTH] Fetch profile exception:', err);
      return { profile: null, status: 500 };
    }
  }, []);

  // 3. Establish full session & restore profile state
  const establishSession = useCallback(async (user: User) => {
    try {
      setProfileLoading(true);
      setError(null);

      // Create/Verify JWT session
      const { jwt: token, profile: sessionProfile } = await createSession(user);
      setJwt(token);
      localStorage.setItem('aura_jwt_token', token);

      // Query database profile using verified JWT
      const { profile: loadedProfile, status: profileHttpStatus } = await fetchProfileMe(token);

      if (profileHttpStatus === 200 && loadedProfile) {
        setProfile(loadedProfile);
        setStatus('authenticated');
      } else if (profileHttpStatus === 404) {
        // Genuine missing profile -> onboarding required
        setProfile(null);
        setStatus('needs-profile');
      } else if (profileHttpStatus === 401) {
        // Attempt ONE retry with fresh Firebase token
        console.warn('[AUTH] 401 on profile fetch. Retrying token refresh...');
        const freshIdToken = await user.getIdToken(true);
        const retrySession = await fetch(`${getApiBaseUrl()}/auth/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: freshIdToken }),
        });

        if (retrySession.ok) {
          const retryData = await retrySession.json();
          const retryToken = retryData.token;
          setJwt(retryToken);
          localStorage.setItem('aura_jwt_token', retryToken);

          const { profile: retryLoaded, status: retryStatus } = await fetchProfileMe(retryToken);
          if (retryStatus === 200 && retryLoaded) {
            setProfile(retryLoaded);
            setStatus('authenticated');
            return;
          } else if (retryStatus === 404) {
            setProfile(null);
            setStatus('needs-profile');
            return;
          }
        }

        // If retry still fails 401 -> sign out
        setJwt(null);
        setProfile(null);
        localStorage.removeItem('aura_jwt_token');
        setStatus('unauthenticated');
      } else {
        // 500 or Network failure -> DO NOT convert 500 to needs-profile!
        console.error('[AUTH] Backend server error loading profile. HTTP Status:', profileHttpStatus);
        if (sessionProfile && sessionProfile.profile_completed) {
          setProfile(sessionProfile);
          setStatus('authenticated');
        } else {
          setError(`Server error (${profileHttpStatus}) loading profile. Please refresh.`);
        }
      }
    } catch (err: any) {
      console.error('[AUTH] Session establishment failed:', err);
      setError(err.message || 'Failed to establish authentication session');
    } finally {
      setProfileLoading(false);
    }
  }, [createSession, fetchProfileMe]);

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
          setJwt(null);
          setProfile(null);
          setStatus('unauthenticated');
          firebaseSignOut(auth).catch(() => { });
        } else if (e.newValue !== jwt) {
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

  const handleSetProfile = useCallback((newProfile: UserProfile | null) => {
    setProfile(newProfile);
    if (newProfile && newProfile.profile_completed !== false) {
      setStatus('authenticated');
    }
  }, []);

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
    setProfile: handleSetProfile,
    clearError,
  }), [
    firebaseUser, profile, jwt, status, authInitialized, profileLoading, error,
    loginWithEmail, signupWithEmail, loginWithGoogle, loginWithPhone, verifyPhoneOTP,
    logout, refreshProfile, handleSetProfile, clearError,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

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
