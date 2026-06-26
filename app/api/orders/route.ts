import { NextResponse } from 'next/server';
import { createOrder, listOrders } from '@/lib/server/order-store';
import { isOwner } from '@/lib/server/owner';
import type { OrderLine } from '@/lib/orders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Owner: list all orders (newest first). */
export async function GET(req: Request) {
  if (!isOwner(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ orders: listOrders() });
}

/** Customer: place a pickup order. Public. */
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const items: OrderLine[] = Array.isArray(body?.items) ? body.items : [];
  const name = String(body?.customer?.name || '').trim();
  const phone = String(body?.customer?.phone || '').trim();

  if (!items.length || !name || !phone || !body?.pickupTime) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }

  const subtotal = items.reduce((s, l) => s + l.price * l.quantity, 0);
  const taxes = Math.round(subtotal * 0.14975 * 100) / 100;
  const total = Math.round((subtotal + taxes) * 100) / 100;

  const order = createOrder({
    customer: { name, phone, email: body.customer.email || undefined },
    pickupTime: String(body.pickupTime),
    items: items.map((l) => ({
      id: l.id,
      name: l.name,
      price: l.price,
      quantity: l.quantity,
      notes: l.notes || undefined,
    })),
    subtotal,
    taxes,
    total,
    note: body.note || undefined,
  });

  return NextResponse.json({ order }, { status: 201 });
}
