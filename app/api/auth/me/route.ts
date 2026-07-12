import { NextResponse } from 'next/server';
import { currentCustomer } from '@/lib/server/session';
import { toPublic } from '@/lib/server/customer-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Return the signed-in customer (or null). Used to hydrate the client. */
export async function GET() {
  const c = await currentCustomer();
  return NextResponse.json({ customer: c ? toPublic(c) : null });
}
