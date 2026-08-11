import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const fallbackProjectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || 'auraai-c70b0';

// Check credential environment variables in order of precedence:
// 1. FIREBASE_SERVICE_ACCOUNT_JSON (User explicit Render variable)
// 2. FIREBASE_SERVICE_ACCOUNT_KEY
const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

let app: any = null;
let initMethod = 'none';
let resolvedProjectId = fallbackProjectId;
let serviceAccountRead = false;

if (getApps().length === 0) {
  // 1. Try full JSON service account
  if (serviceAccountRaw) {
    serviceAccountRead = true;
    try {
      // Handle double-escaped newlines or raw JSON string
      const sanitizedJson = serviceAccountRaw.trim();
      const serviceAccount = JSON.parse(sanitizedJson);

      if (serviceAccount && typeof serviceAccount === 'object') {
        resolvedProjectId = serviceAccount.project_id || fallbackProjectId;
        app = initializeApp({
          credential: cert(serviceAccount),
          projectId: resolvedProjectId,
        });
        initMethod = 'service_account_json';
        console.log(`🔥 [Firebase Admin] Initialized via service account JSON (Project ID: ${resolvedProjectId})`);
      }
    } catch (err: any) {
      console.warn('⚠️ [Firebase Admin] Failed to parse service account JSON:', err?.message || err);
    }
  }

  // 2. Try individual env variables (clientEmail + privateKey)
  if (!app && clientEmail && privateKeyRaw) {
    try {
      const privateKey = privateKeyRaw.replace(/\\n/g, '\n');
      app = initializeApp({
        credential: cert({
          projectId: fallbackProjectId,
          clientEmail,
          privateKey,
        }),
        projectId: fallbackProjectId,
      });
      initMethod = 'individual_env_vars';
      console.log(`🔥 [Firebase Admin] Initialized via FIREBASE_CLIENT_EMAIL & FIREBASE_PRIVATE_KEY (Project ID: ${fallbackProjectId})`);
    } catch (err: any) {
      console.warn('⚠️ [Firebase Admin] Failed to initialize with individual env vars:', err?.message || err);
    }
  }

  // 3. Public cert verification fallback with explicit projectId (allows verifyIdToken using Google public X509 certs)
  if (!app) {
    try {
      app = initializeApp({ projectId: fallbackProjectId });
      initMethod = 'public_project_id';
      console.log(`🔥 [Firebase Admin] Initialized via explicit Project ID: ${fallbackProjectId}`);
    } catch (err: any) {
      console.error('❌ [Firebase Admin] Failed project initialization:', err?.message || err);
    }
  }
} else {
  app = getApps()[0];
  initMethod = 'existing_app_instance';
}

console.log(`[FIREBASE DIAGNOSTICS] FIREBASE_ADMIN_CONFIGURED=${Boolean(app)}`);
console.log(`[FIREBASE DIAGNOSTICS] FIREBASE_ADMIN_PROJECT=${resolvedProjectId}`);
console.log(`[FIREBASE DIAGNOSTICS] FIREBASE_SERVICE_ACCOUNT_READ=${serviceAccountRead}`);
console.log(`[FIREBASE DIAGNOSTICS] FIREBASE_INIT_METHOD=${initMethod}`);

export const firebaseAdmin = app;
export const firebaseAuth = getAuth(app);
export const getFirebaseAdminStatus = () => ({
  configured: Boolean(app),
  projectId: resolvedProjectId,
  serviceAccountRead,
  initMethod,
});
