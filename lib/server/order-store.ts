/**
 * Order store. Dual-path: uses Supabase Postgres when configured (production,
 * survives serverless), otherwise a file-backed store for local dev. All
 * functions are async so callers are host-agnostic.
 *
 * The dashboard reads orders by polling GET /api/orders — no in-process
 * pub/sub, so it works across serverless instances.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  type Order,
  type OrderStatus,
  generateOrderNumber,
} from '@/lib/orders';
import { useSupabase, supa } from './supabase';

/* ─────────────────────────── File fallback (dev) ─────────────────────────── */

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'orders.json');
const g = globalThis as unknown as { __pcOrders?: Map<string, Order> };

function fileLoad(): Map<string, Order> {
  if (g.__pcOrders) return g.__pcOrders;
  const map = new Map<string, Order>();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const arr = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) as Order[];
      for (const o of arr) map.set(o.id, o);
    }
  } catch {
    /* start empty on a corrupt file */
  }
  g.__pcOrders = map;
  return map;
}

function filePersist() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify([...fileLoad().values()], null, 2));
  } catch {
    /* best-effort */
  }
}

/* ─────────────────────────── Row mapping ─────────────────────────── */

function rowToOrder(r: any): Order {
  return {
    id: r.id,
    createdAt: Number(r.created_at),
    updatedAt: Number(r.updated_at),
    status: r.status as OrderStatus,
    customerId: r.customer_id ?? undefined,
    customer: r.customer,
    pickupTime: r.pickup_time,
    items: r.items,
    subtotal: Number(r.subtotal),
    taxes: Number(r.taxes),
    total: Number(r.total),
    note: r.note ?? undefined,
  };
}

function orderToRow(o: Order) {
  return {
    id: o.id,
    created_at: o.createdAt,
    updated_at: o.updatedAt,
    status: o.status,
    customer_id: o.customerId ?? null,
    customer: o.customer,
    pickup_time: o.pickupTime,
    items: o.items,
    subtotal: o.subtotal,
    taxes: o.taxes,
    total: o.total,
    note: o.note ?? null,
  };
}

/* ─────────────────────────── API ─────────────────────────── */

export async function listOrders(): Promise<Order[]> {
  if (useSupabase) {
    const { data, error } = await supa()
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToOrder);
  }
  return [...fileLoad().values()].sort((a, b) => b.createdAt - a.createdAt);
}

export async function getOrder(id: string): Promise<Order | undefined> {
  if (useSupabase) {
    const { data } = await supa().from('orders').select('*').eq('id', id).maybeSingle();
    return data ? rowToOrder(data) : undefined;
  }
  return fileLoad().get(id);
}

/**
 * Orders belonging to a customer — matched by account id OR by the email used
 * at checkout (so guest orders placed before they registered still show up).
 */
export async function listOrdersForCustomer(customerId: string, email?: string): Promise<Order[]> {
  const e = email?.trim().toLowerCase();
  if (useSupabase) {
    const byId = supa().from('orders').select('*').eq('customer_id', customerId);
    const results = [(await byId).data ?? []];
    if (e) {
      const byEmail = await supa().from('orders').select('*').ilike('customer->>email', e);
      results.push(byEmail.data ?? []);
    }
    const map = new Map<string, Order>();
    for (const rows of results) for (const r of rows) map.set(r.id, rowToOrder(r));
    return [...map.values()].sort((a, b) => b.createdAt - a.createdAt);
  }
  return [...fileLoad().values()]
    .filter((o) => o.customerId === customerId || (!!e && o.customer.email?.trim().toLowerCase() === e))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function createOrder(
  input: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<Order> {
  const now = Date.now();

  if (useSupabase) {
    // Retry on the rare order-number collision.
    for (let attempt = 0; attempt < 6; attempt++) {
      const order: Order = { ...input, id: generateOrderNumber(), createdAt: now, updatedAt: now, status: 'pending' };
      const { error } = await supa().from('orders').insert(orderToRow(order));
      if (!error) return order;
      if (error.code !== '23505') throw error; // 23505 = unique violation → retry
    }
    throw new Error('could not allocate order number');
  }

  const map = fileLoad();
  let id = generateOrderNumber();
  while (map.has(id)) id = generateOrderNumber();
  const order: Order = { ...input, id, createdAt: now, updatedAt: now, status: 'pending' };
  map.set(id, order);
  filePersist();
  return order;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | undefined> {
  const updatedAt = Date.now();
  if (useSupabase) {
    const { data, error } = await supa()
      .from('orders')
      .update({ status, updated_at: updatedAt })
      .eq('id', id)
      .select('*')
      .maybeSingle();
    if (error) throw error;
    return data ? rowToOrder(data) : undefined;
  }
  const map = fileLoad();
  const order = map.get(id);
  if (!order) return undefined;
  order.status = status;
  order.updatedAt = updatedAt;
  map.set(id, order);
  filePersist();
  return order;
}
