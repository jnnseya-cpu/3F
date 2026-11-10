import { NextRequest, NextResponse } from 'next/server';
import { runTrendCycle } from '@/lib/trend/cycle';

/**
 * Trend cycle cron — invisible background run of the trend→brief pipeline.
 * Protect with Cloud Scheduler sending `Authorization: Bearer <CRON_SECRET>`.
 * Fail-closed: no CRON_SECRET ⇒ 503 (not publicly triggerable). Also runs
 * automatically inside the daily SEO autopilot cron; this endpoint allows a
 * dedicated, more frequent schedule if wanted.
 */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return NextResponse.json({ error: 'Cron not configured' }, { status: 503 });
  if (req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const result = await runTrendCycle();
    return NextResponse.json({ ran: true, ...result });
  } catch (e) {
    console.error('trend cycle failed:', e);
    return NextResponse.json({ ran: false, error: 'cycle failed' }, { status: 500 });
  }
}
