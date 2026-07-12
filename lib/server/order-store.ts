/**
 * Server-only order store. Backs the customer order flow + owner dashboard with
 * a single in-process source of truth, persisted to .data/orders.json so it
 * survives dev restarts. A tiny pub/sub powers the dashboard's SSE stream.
 *
 * This is intentionally dependency-free (no DB). For multi-instance production,
 * swap this module for Supabase/Postgres — the API surface stays the same.
 */
import fs from 'node:fs';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import {
  type Order,
  type OrderStatus,
  generateOrderNumber,
} from '@/lib/orders';

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'orders.json');

// Persist across HMR reloads by stashing on globalThis.
const g = globalThis as unknown as {
  __pcOrders?: Map<string, Order>;
  __pcBus?: EventEmitter;
};

function load(): Map<string, Order> {
  if (g.__pcOrders) return g.__pcOrders;
  const map = new Map<string, Order>();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const arr = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) as Order[];
      for (const o of arr) map.set(o.id, o);
    }
  } catch {
    /* start empty on corrupt file */
  }
  g.__pcOrders = map;
  return map;
}

function persist() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify([...load().values()], null, 2));
  } catch {
    /* best-effort */
  }
}

export const bus: EventEmitter = (g.__pcBus ??= new EventEmitter());
bus.setMaxListeners(50);

export type OrderEvent =
  | { type: 'created'; order: Order }
  | { type: 'updated'; order: Order };

function emit(event: OrderEvent) {
  bus.emit('order', event);
}

export function listOrders(): Order[] {
  return [...load().values()].sort((a, b) => b.createdAt - a.createdAt);
}

export function getOrder(id: string): Order | undefined {
  return load().get(id);
}

/**
 * Orders belonging to a customer — matched by account id OR by the email used
 * at checkout (so guest orders placed before they registered still show up).
 */
export function listOrdersForCustomer(customerId: string, email?: string): Order[] {
  const e = email?.trim().toLowerCase();
  return [...load().values()]
    .filter((o) => o.customerId === customerId || (!!e && o.customer.email?.trim().toLowerCase() === e))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function createOrder(input: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Order {
  const map = load();
  let id = generateOrderNumber();
  while (map.has(id)) id = generateOrderNumber();
  const now = Date.now();
  const order: Order = { ...input, id, createdAt: now, updatedAt: now, status: 'pending' };
  map.set(id, order);
  persist();
  emit({ type: 'created', order });
  return order;
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | undefined {
  const map = load();
  const order = map.get(id);
  if (!order) return undefined;
  order.status = status;
  order.updatedAt = Date.now();
  map.set(id, order);
  persist();
  emit({ type: 'updated', order });
  return order;
}
