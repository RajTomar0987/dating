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

  const maskedApiKey = config.apiKey
    ? `${config.apiKey.substring(0, 6)}...${config.apiKey.substring(config.apiKey.length - 4)}`
    : 'MISSING';

  console.log('[FIREBASE] Validating Firebase initialization parameters:');
  console.log('[FIREBASE] Project ID:', config.projectId || 'MISSING');
  console.log('[FIREBASE] Auth Domain:', config.authDomain || 'MISSING');
  console.log('[FIREBASE] Storage Bucket:', config.storageBucket || 'MISSING');
  console.log('[FIREBASE] Messaging Sender ID:', config.messagingSenderId || 'MISSING');
  console.log('[FIREBASE] App ID:', config.appId || 'MISSING');
  console.log('[FIREBASE] API Key (Masked):', maskedApiKey);

  if (missing.length > 0) {
    console.error(`[FIREBASE] ERROR: The following Firebase configuration fields are missing or invalid: ${missing.join(', ')}`);
    return false;
  }

  console.log('[FIREBASE] Firebase configuration validated successfully.');
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
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
};

export type { User, ConfirmationResult };
