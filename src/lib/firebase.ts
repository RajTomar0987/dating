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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBdgibMHNrX9ZQ6E2-fjuMDAj2uCultFqc',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'auraai-c70b0.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'auraai-c70b0',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'auraai-c70b0.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '853425447268',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:853425447268:web:604381a97d877efedd5a71',
};

// Safe diagnostic logging (without exposing API keys)
console.log('[FIREBASE] projectId:', firebaseConfig.projectId);
console.log('[FIREBASE] authDomain:', firebaseConfig.authDomain);
console.log('[FIREBASE] API key configured:', Boolean(firebaseConfig.apiKey));

if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('DemoPlaceholder')) {
  console.error('[FIREBASE] Invalid or missing Firebase API Key configuration!');
}

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
