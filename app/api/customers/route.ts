import { NextResponse } from 'next/server';
import { listCustomers } from '@/lib/server/customer-store';
import { isOwner } from '@/lib/server/owner';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Owner: the full customer + lead list (for retargeting). */
export async function GET(req: Request) {
  if (!isOwner(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  // Strip password fields — send only what the dashboard shows.
  const customers = listCustomers().map((c) => ({
    id: c.id,
    email: c.email,
    name: c.name,
    phone: c.phone,
    registered: c.registered,
    marketingOptIn: c.marketingOptIn,
    orderCount: c.orderCount,
    createdAt: c.createdAt,
    lastOrderAt: c.lastOrderAt ?? null,
  }));
  return NextResponse.json({ customers });
}
