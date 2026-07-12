import { NextResponse } from 'next/server';
import { listOrdersForCustomer } from '@/lib/server/order-store';
import { currentCustomer } from '@/lib/server/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** The signed-in customer's own order history. */
export async function GET() {
  const c = currentCustomer();
  if (!c) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return NextResponse.json({ orders: listOrdersForCustomer(c.id, c.email) });
}
