import { NextResponse } from 'next/server';
import { createOrder, listOrders } from '@/lib/server/order-store';
import { isOwner } from '@/lib/server/owner';
import { isValidEmail, upsertLeadFromOrder } from '@/lib/server/customer-store';
import { normalizePhone, formatPhone } from '@/lib/phone';
import { currentCustomer } from '@/lib/server/session';
import { sendOrderConfirmation } from '@/lib/server/email';
import type { OrderLine } from '@/lib/orders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Owner: list all orders (newest first). */
export async function GET(req: Request) {
  if (!isOwner(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ orders: await listOrders() });
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
  const rawPhone = String(body?.customer?.phone || '').trim();
  const email = String(body?.customer?.email || '').trim();

  if (!items.length || !name || !rawPhone || !body?.pickupTime) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }
  // Email is required so every order feeds the marketing (retargeting) list.
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }
  // Phone must be a valid, callable NANP number — stored in a clean format.
  if (!normalizePhone(rawPhone)) {
    return NextResponse.json({ error: 'invalid_phone' }, { status: 400 });
  }
  const phone = formatPhone(rawPhone);

  const subtotal = items.reduce((s, l) => s + l.price * l.quantity, 0);
  const taxes = Math.round(subtotal * 0.14975 * 100) / 100;
  const total = Math.round((subtotal + taxes) * 100) / 100;

  // Capture / update the customer in the retargeting list (guest or account).
  await upsertLeadFromOrder({ email, name, phone, marketingOptIn: body?.marketingOptIn !== false });

  // Link the order to the signed-in account (if any) so it shows in history.
  const account = await currentCustomer();

  const order = await createOrder({
    customerId: account?.id,
    customer: { name, phone, email },
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

  // Send a confirmation email (no-op unless RESEND_API_KEY + RESEND_FROM are set).
  // Awaited but never fatal — a failed email must not fail the order.
  try {
    await sendOrderConfirmation(order, body?.lang === 'fr' ? 'fr' : 'en');
  } catch {
    /* ignore */
  }

  return NextResponse.json({ order }, { status: 201 });
}
