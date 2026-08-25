import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

/**
 * Firebase Admin (service-account) access — the ONLY writer allowed to touch
 * the financial collections in production.
 *
 * Why this exists: the REST + Web-API-key path authenticates as an
 * *unauthenticated client*, so Firestore security rules cannot tell our server
 * apart from an attacker holding the same (non-secret) key. The Admin SDK
 * authenticates as a service account and BYPASSES rules — which lets us set
 * the rules to deny ALL client access to money data (acu_accounts,
 * processed_payments, member activation) while the server keeps working.
 *
 * Credentials (set in Vercel env):
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY        (paste the PEM; \n escapes are handled)
 * or a single JSON blob:
 *   FIREBASE_SERVICE_ACCOUNT    ({ project_id, client_email, private_key })
 *
 * When these are absent, adminDb() returns null and callers fall back to the
 * REST path (pre-launch / demo). Production go-live = set these + apply the
 * locked firestore.rules together.
 */

let cached: Firestore | null | undefined;

function loadCredentials(): { projectId: string; clientEmail: string; privateKey: string } | null {
  const blob = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (blob) {
    try {
      const j = JSON.parse(blob);
      const projectId = j.project_id || j.projectId;
      const clientEmail = j.client_email || j.clientEmail;
      const privateKey = (j.private_key || j.privateKey || '').replace(/\\n/g, '\n');
      if (projectId && clientEmail && privateKey) return { projectId, clientEmail, privateKey };
    } catch {
      /* fall through to discrete vars */
    }
  }
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (projectId && clientEmail && privateKey) return { projectId, clientEmail, privateKey };
  return null;
}

/** Returns the admin Firestore instance, or null if no service account is configured. */
export function adminDb(): Firestore | null {
  if (cached !== undefined) return cached;
  const creds = loadCredentials();
  if (!creds) {
    cached = null;
    return null;
  }
  try {
    const app: App =
      getApps().find(a => a.name === 'lcd-admin') ??
      initializeApp(
        {
          credential: cert({
            projectId: creds.projectId,
            clientEmail: creds.clientEmail,
            privateKey: creds.privateKey,
          }),
        },
        'lcd-admin',
      );
    cached = getFirestore(app);
    return cached;
  } catch (e) {
    console.error('Firebase Admin init failed:', e);
    cached = null;
    return null;
  }
}

export function adminConfigured(): boolean {
  return adminDb() !== null;
}
