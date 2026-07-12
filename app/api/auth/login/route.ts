import { NextResponse } from 'next/server';
import { verifyLogin, toPublic } from '@/lib/server/customer-store';
import { startSession } from '@/lib/server/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Verify credentials and start a session. Public. */
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const email = String(body?.email || '').trim();
  const password = String(body?.password || '');
  if (!email || !password) return NextResponse.json({ error: 'missing_fields' }, { status: 400 });

  const record = verifyLogin(email, password);
  if (!record) return NextResponse.json({ error: 'bad_credentials' }, { status: 401 });

  startSession(record.id);
  return NextResponse.json({ customer: toPublic(record) });
}
