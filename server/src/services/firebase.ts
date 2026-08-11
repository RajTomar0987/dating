import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || 'auraai-c70b0';
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

let app: any = null;
let initMethod = 'none';

if (getApps().length === 0) {
  // 1. Try full JSON service account
  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || projectId,
      });
      initMethod = 'service_account_json';
      console.log(`🔥 [Firebase Admin] Initialized via FIREBASE_SERVICE_ACCOUNT_KEY (Project ID: ${serviceAccount.project_id || projectId})`);
    } catch (err: any) {
      console.warn('⚠️ [Firebase Admin] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON:', err?.message || err);
    }
  }

  // 2. Try individual env variables (clientEmail + privateKey)
  if (!app && clientEmail && privateKeyRaw) {
    try {
      const privateKey = privateKeyRaw.replace(/\\n/g, '\n');
      app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        projectId,
      });
      initMethod = 'individual_env_vars';
      console.log(`🔥 [Firebase Admin] Initialized via FIREBASE_CLIENT_EMAIL & FIREBASE_PRIVATE_KEY (Project ID: ${projectId})`);
    } catch (err: any) {
      console.warn('⚠️ [Firebase Admin] Failed to initialize with individual env vars:', err?.message || err);
    }
  }

  // 3. Public cert verification fallback with explicit projectId (allows verifyIdToken using Google public X509 certs)
  if (!app) {
    try {
      app = initializeApp({ projectId });
      initMethod = 'public_project_id';
      console.log(`🔥 [Firebase Admin] Initialized via explicit Project ID: ${projectId}`);
    } catch (err: any) {
      console.error('❌ [Firebase Admin] Failed project initialization:', err?.message || err);
    }
  }
} else {
  app = getApps()[0];
  initMethod = 'existing_app_instance';
}

console.log(`[FIREBASE DIAGNOSTICS] Admin Initialized: ${Boolean(app)} | Method: ${initMethod} | Project ID: ${projectId}`);

export const firebaseAdmin = app;
export const firebaseAuth = getAuth(app);
export const getFirebaseAdminStatus = () => ({
  initialized: Boolean(app),
  projectId,
  initMethod,
});
