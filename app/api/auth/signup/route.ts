import { NextResponse } from 'next/server';
import { createAccount, isValidEmail, toPublic, AccountError } from '@/lib/server/customer-store';
import { normalizePhone, formatPhone } from '@/lib/phone';
import { startSession } from '@/lib/server/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Create an email/password account and start a session. Public. */
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const email = String(body?.email || '').trim();
  const name = String(body?.name || '').trim();
  const phone = String(body?.phone || '').trim();
  const password = String(body?.password || '');
  const marketingOptIn = body?.marketingOptIn !== false; // default opt-in

  if (!name || !phone) return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  if (!isValidEmail(email)) return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  if (!normalizePhone(phone)) return NextResponse.json({ error: 'invalid_phone' }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: 'weak_password' }, { status: 400 });

  try {
    const record = createAccount({ email, name, phone: formatPhone(phone), password, marketingOptIn });
    startSession(record.id);
    return NextResponse.json({ customer: toPublic(record) }, { status: 201 });
  } catch (e) {
    if (e instanceof AccountError) {
      return NextResponse.json({ error: 'email_taken' }, { status: 409 });
    }
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
