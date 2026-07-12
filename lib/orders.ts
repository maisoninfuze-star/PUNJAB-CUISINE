/**
 * Shared order types + helpers, used by the customer order flow, the API, and
 * the owner dashboard.
 */

export type OrderStatus =
  | 'pending' // awaiting owner accept/deny
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface OrderLine {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string; // e.g. PC-4821
  createdAt: number;
  updatedAt: number;
  status: OrderStatus;
  /** Set when the order was placed by a signed-in account (for order history). */
  customerId?: string;
  customer: { name: string; phone: string; email?: string };
  pickupTime: string; // ISO
  items: OrderLine[];
  subtotal: number;
  taxes: number;
  total: number;
  note?: string;
}

/** The linear lifecycle the customer-facing timeline follows. */
export const STATUS_FLOW: OrderStatus[] = [
  'pending',
  'accepted',
  'preparing',
  'ready',
  'completed',
];

/** Bilingual labels + a colour token for each status. */
export const STATUS_META: Record<
  OrderStatus,
  { en: string; fr: string; tone: string }
> = {
  pending: { en: 'New', fr: 'Nouvelle', tone: 'gold' },
  accepted: { en: 'Accepted', fr: 'Acceptée', tone: 'sky' },
  preparing: { en: 'Preparing', fr: 'En préparation', tone: 'amber' },
  ready: { en: 'Ready for pickup', fr: 'Prête', tone: 'emerald' },
  completed: { en: 'Completed', fr: 'Complétée', tone: 'zinc' },
  cancelled: { en: 'Cancelled', fr: 'Annulée', tone: 'rose' },
};

/** Active orders are the ones the kitchen still needs to act on. */
export const ACTIVE_STATUSES: OrderStatus[] = [
  'pending',
  'accepted',
  'preparing',
  'ready',
];

export function generateOrderNumber(): string {
  return 'PC-' + Math.floor(1000 + Math.random() * 9000);
}
