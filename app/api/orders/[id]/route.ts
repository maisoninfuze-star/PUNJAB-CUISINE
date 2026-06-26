import { NextResponse } from 'next/server';
import { getOrder, updateOrderStatus } from '@/lib/server/order-store';
import { isOwner } from '@/lib/server/owner';
import { STATUS_META, type OrderStatus } from '@/lib/orders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Public: fetch a single order (customer status lookup). */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const order = getOrder(params.id);
  if (!order) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ order });
}

/** Owner: update an order's status (accept / deny / preparing / ready / …). */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!isOwner(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  const status = body?.status as OrderStatus;
  if (!status || !(status in STATUS_META)) {
    return NextResponse.json({ error: 'invalid status' }, { status: 400 });
  }
  const order = updateOrderStatus(params.id, status);
  if (!order) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ order });
}
