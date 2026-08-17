import { NextRequest, NextResponse } from 'next/server';
import { buildNewsletterHtml } from '@/lib/newsletter';
import { unsubscribeToken } from '@/lib/newsletterAuth';

/**
 * Weekly newsletter — runs on a Vercel cron (see vercel.json "crons").
 *
 * Reuses established platform patterns:
 *  - CRON_SECRET auth (same as /api/seo/autopilot)
 *  - Firestore REST access to the `members` collection (same as register)
 *  - Absolute-URL links from NEXT_PUBLIC_SITE_URL
 *
 * Sends to every registered member who has an email and has NOT unsubscribed
 * (members.newsletterOptOut !== true). Idempotent per ISO-week: a
 * newsletter_log/{year-Www} marker prevents a double send in the same week.
 *
 * Degrades gracefully: with no Firebase or no email provider it reports a
 * skip instead of failing.
 */

const FIRESTORE = 'https://firestore.googleapis.com/v1/projects';
const MAX_PER_RUN = 2000; // hard cap; excess is logged, never silently dropped

function base(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://congodabord.cd').replace(/\/$/, '');
}

function isoWeek(d: Date): string {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((date.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

interface Recipient { email: string; firstName: string; }

async function listRecipients(projectId: string, apiKey: string): Promise<Recipient[]> {
  const out: Recipient[] = [];
  let pageToken = '';
  do {
    const url = `${FIRESTORE}/${projectId}/databases/(default)/documents/members?key=${apiKey}&pageSize=300${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`members list ${res.status}`);
    const data = await res.json();
    for (const doc of data.documents || []) {
      const f = doc.fields || {};
      const email = f.email?.stringValue?.trim();
      const optOut = f.newsletterOptOut?.booleanValue === true;
      if (email && !optOut && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        out.push({ email, firstName: f.firstName?.stringValue || '' });
      }
    }
    pageToken = data.nextPageToken || '';
  } while (pageToken && out.length < MAX_PER_RUN);
  return out;
}

async function alreadySentThisWeek(projectId: string, apiKey: string, week: string): Promise<boolean> {
  const url = `${FIRESTORE}/${projectId}/databases/(default)/documents/newsletter_log/${week}?key=${apiKey}`;
  const res = await fetch(url, { cache: 'no-store' });
  return res.ok; // 200 = doc exists = already sent
}

async function markSent(projectId: string, apiKey: string, week: string, count: number) {
  const url = `${FIRESTORE}/${projectId}/databases/(default)/documents/newsletter_log?documentId=${week}&key=${apiKey}`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: { sentAt: { stringValue: new Date().toISOString() }, count: { integerValue: String(count) } } }),
  });
}

async function sendEmail(to: string, subject: string, html: string, text: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_FROM || "Le Congo D'Abord <newsletter@congodabord.cd>";
  if (!key) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ from, to, subject, html, text }),
  });
  if (!res.ok) {
    console.error('Resend error:', (await res.text()).slice(0, 200));
    return false;
  }
  return true;
}

export async function GET(req: NextRequest) {
  // Cron authenticity (same pattern as the SEO autopilot)
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const apiKey = process.env.FIREBASE_API_KEY;
  if (!projectId || !apiKey) {
    return NextResponse.json({ status: 'skipped', reason: 'firebase-not-configured' }, { status: 503 });
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ status: 'skipped', reason: 'email-provider-not-configured' }, { status: 503 });
  }

  const week = isoWeek(new Date());
  try {
    if (await alreadySentThisWeek(projectId, apiKey, week)) {
      return NextResponse.json({ status: 'skipped', reason: 'already-sent', week });
    }

    const recipients = await listRecipients(projectId, apiKey);
    if (recipients.length === 0) {
      await markSent(projectId, apiKey, week, 0);
      return NextResponse.json({ status: 'sent', week, recipients: 0 });
    }
    if (recipients.length >= MAX_PER_RUN) {
      console.warn(`Newsletter: recipient cap ${MAX_PER_RUN} reached — remaining members not sent this run.`);
    }

    const weekIndex = parseInt(week.split('-W')[1], 10) || 0;
    let sent = 0, failed = 0;
    for (const r of recipients) {
      const unsub = `${base()}/api/newsletter/unsubscribe?e=${encodeURIComponent(r.email)}&t=${unsubscribeToken(r.email)}`;
      const { subject, html, text } = buildNewsletterHtml(base(), r.firstName, unsub, weekIndex);
      const ok = await sendEmail(r.email, subject, html, text);
      ok ? sent++ : failed++;
    }

    await markSent(projectId, apiKey, week, sent);
    return NextResponse.json({ status: 'sent', week, recipients: recipients.length, sent, failed });
  } catch (error) {
    console.error('Newsletter send error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
