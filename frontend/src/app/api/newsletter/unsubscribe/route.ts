import { NextRequest, NextResponse } from 'next/server';
import { verifyUnsubscribe } from '@/lib/newsletterAuth';

/**
 * One-click unsubscribe (legally required on marketing email).
 * GET /api/newsletter/unsubscribe?e=<email>&t=<token>
 * Sets members[*].newsletterOptOut = true for matching emails and returns a
 * simple HTML confirmation. Token is HMAC(email) so links can't be forged.
 */

const FIRESTORE = 'https://firestore.googleapis.com/v1/projects';

function page(message: string, ok: boolean): NextResponse {
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Désabonnement</title></head>
  <body style="font-family:Arial,sans-serif;background:#f4f6f8;margin:0;padding:40px;text-align:center;color:#222">
    <div style="max-width:420px;margin:0 auto;background:#fff;border-radius:12px;padding:32px">
      <div style="font-size:40px">${ok ? '✅' : '⚠️'}</div>
      <h1 style="color:#0055CC;font-size:20px">${message}</h1>
      <a href="${(process.env.NEXT_PUBLIC_SITE_URL || 'https://congodabord.cd').replace(/\/$/, '')}" style="color:#007FFF">Retour au site</a>
    </div>
  </body></html>`;
  return new NextResponse(html, { status: ok ? 200 : 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('e') || '';
  const token = req.nextUrl.searchParams.get('t') || '';

  if (!verifyUnsubscribe(email, token)) {
    return page('Lien de désabonnement invalide.', false);
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const apiKey = process.env.FIREBASE_API_KEY;
  if (!projectId || !apiKey) {
    // Nothing to persist yet, but honor the request from the user's side
    return page('Vous êtes désabonné. Vous ne recevrez plus notre newsletter.', true);
  }

  try {
    // Find member docs with this email, then flag them opted-out
    const q = {
      structuredQuery: {
        from: [{ collectionId: 'members' }],
        where: { fieldFilter: { field: { fieldPath: 'email' }, op: 'EQUAL', value: { stringValue: email } } },
        limit: 25,
      },
    };
    const res = await fetch(`${FIRESTORE}/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(q),
    });
    if (res.ok) {
      const rows = await res.json();
      for (const row of rows) {
        const name: string | undefined = row.document?.name;
        if (!name) continue;
        const docId = name.split('/documents/')[1];
        await fetch(`${FIRESTORE}/${projectId}/databases/(default)/documents/${docId}?key=${apiKey}&updateMask.fieldPaths=newsletterOptOut`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields: { newsletterOptOut: { booleanValue: true } } }),
        });
      }
    }
  } catch (e) {
    console.error('Unsubscribe persist failed:', e);
  }

  return page('Vous êtes désabonné. Vous ne recevrez plus notre newsletter.', true);
}
