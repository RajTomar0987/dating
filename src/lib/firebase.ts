import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  indexedDBLocalPersistence,
  GoogleAuthProvider,
  PhoneAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  type User,
  type ConfirmationResult,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY || '').trim(),
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '').trim(),
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || '').trim(),
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '').trim(),
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '').trim(),
  appId: (import.meta.env.VITE_FIREBASE_APP_ID || '').trim(),
};

// Safe diagnostic validation
function validateFirebaseConfig(config: typeof firebaseConfig): boolean {
  const missing: string[] = [];

  if (!config.apiKey || config.apiKey.includes('DemoPlaceholder') || config.apiKey.length < 10) {
    missing.push('VITE_FIREBASE_API_KEY');
  }
  if (!config.authDomain) missing.push('VITE_FIREBASE_AUTH_DOMAIN');
  if (!config.projectId) missing.push('VITE_FIREBASE_PROJECT_ID');
  if (!config.storageBucket) missing.push('VITE_FIREBASE_STORAGE_BUCKET');
  if (!config.messagingSenderId) missing.push('VITE_FIREBASE_MESSAGING_SENDER_ID');
  if (!config.appId) missing.push('VITE_FIREBASE_APP_ID');

  const apiKeyFirst6 = config.apiKey ? config.apiKey.substring(0, 6) : 'NONE';
  const apiKeyExists = Boolean(config.apiKey);

  console.log('[FIREBASE] Initialization Diagnostics:');
  console.log('[FIREBASE] projectId:', config.projectId || 'MISSING');
  console.log('[FIREBASE] authDomain:', config.authDomain || 'MISSING');
  console.log('[FIREBASE] API key exists:', apiKeyExists);
  console.log('[FIREBASE] API key (first 6 chars):', apiKeyFirst6);

  if (missing.length > 0) {
    console.error(`[FIREBASE] ERROR: Missing or invalid configuration fields: ${missing.join(', ')}`);
    return false;
  }

  console.log('[FIREBASE] Configuration validated successfully.');
  return true;
}

validateFirebaseConfig(firebaseConfig);

// Initialize Firebase (singleton)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Enforce resilient browser persistence
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('[FIREBASE] Persistence setup notice:', err?.message || err);
});

// Auth Providers
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

export {
  app,
  auth,
  googleProvider,
  appleProvider,
  PhoneAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
};

export type { User, ConfirmationResult };
