import { NextResponse } from 'next/server';
import { endSession } from '@/lib/server/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Clear the session cookie. */
export async function POST() {
  endSession();
  return NextResponse.json({ ok: true });
}
