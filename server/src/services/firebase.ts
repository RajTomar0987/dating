import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

let app: any;
if (getApps().length === 0) {
  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      app = initializeApp({
        credential: cert(serviceAccount),
      });
      console.log('🔥 Firebase Admin SDK initialized with service account');
    } catch (err) {
      console.warn('⚠️ Firebase Admin: Failed to parse service account key, initializing default app');
      app = initializeApp();
    }
  } else {
    try {
      app = initializeApp();
      console.log('🔥 Firebase Admin SDK initialized');
    } catch (err) {
      console.warn('⚠️ Firebase Admin: Default initialization notice (env setup required for production token verification)');
    }
  }
} else {
  app = getApps()[0];
}

export const firebaseAdmin = app;
export const firebaseAuth = getAuth(app);

