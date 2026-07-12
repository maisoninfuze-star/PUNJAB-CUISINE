/**
 * Customer + lead store. Dual-path: Supabase Postgres when configured
 * (production), file-backed for local dev. Backs email/password accounts AND
 * the marketing (retargeting) list. Passwords are hashed with Node's scrypt
 * (salted, timing-safe compare) — plain passwords are never stored.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { PublicCustomer } from '@/lib/customer';
import { useSupabase, supa } from './supabase';

export interface CustomerRecord {
  id: string;
  email: string; // lowercased — the unique key
  name: string;
  phone: string;
  passwordHash?: string;
  passwordSalt?: string;
  registered: boolean;
  marketingOptIn: boolean;
  createdAt: number;
  lastOrderAt?: number;
  orderCount: number;
}

/* ─────────────────────────── File fallback (dev) ─────────────────────────── */

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'customers.json');
const g = globalThis as unknown as { __pcCustomers?: Map<string, CustomerRecord> };

function fileLoad(): Map<string, CustomerRecord> {
  if (g.__pcCustomers) return g.__pcCustomers;
  const map = new Map<string, CustomerRecord>();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const arr = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) as CustomerRecord[];
      for (const c of arr) map.set(c.email, c);
    }
  } catch {
    /* start empty on a corrupt file */
  }
  g.__pcCustomers = map;
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

/* ─────────────────────────── Helpers ─────────────────────────── */

const normEmail = (e: string) => e.trim().toLowerCase();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isValidEmail = (e: string) => EMAIL_RE.test(normEmail(e));

function hash(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function toPublic(c: CustomerRecord): PublicCustomer {
  return {
    id: c.id,
    email: c.email,
    name: c.name,
    phone: c.phone,
    marketingOptIn: c.marketingOptIn,
    registered: c.registered,
  };
}

export class AccountError extends Error {}

function rowToCustomer(r: any): CustomerRecord {
  return {
    id: r.id,
    email: r.email,
    name: r.name,
    phone: r.phone,
    passwordHash: r.password_hash ?? undefined,
    passwordSalt: r.password_salt ?? undefined,
    registered: r.registered,
    marketingOptIn: r.marketing_opt_in,
    createdAt: Number(r.created_at),
    lastOrderAt: r.last_order_at != null ? Number(r.last_order_at) : undefined,
    orderCount: r.order_count ?? 0,
  };
}

function customerToRow(c: CustomerRecord) {
  return {
    id: c.id,
    email: c.email,
    name: c.name,
    phone: c.phone,
    password_hash: c.passwordHash ?? null,
    password_salt: c.passwordSalt ?? null,
    registered: c.registered,
    marketing_opt_in: c.marketingOptIn,
    created_at: c.createdAt,
    last_order_at: c.lastOrderAt ?? null,
    order_count: c.orderCount,
  };
}

/* ─────────────────────────── API ─────────────────────────── */

export async function getByEmail(email: string): Promise<CustomerRecord | undefined> {
  const e = normEmail(email);
  if (useSupabase) {
    const { data } = await supa().from('customers').select('*').eq('email', e).maybeSingle();
    return data ? rowToCustomer(data) : undefined;
  }
  return fileLoad().get(e);
}

export async function getById(id: string): Promise<CustomerRecord | undefined> {
  if (useSupabase) {
    const { data } = await supa().from('customers').select('*').eq('id', id).maybeSingle();
    return data ? rowToCustomer(data) : undefined;
  }
  for (const c of fileLoad().values()) if (c.id === id) return c;
  return undefined;
}

export async function listCustomers(): Promise<CustomerRecord[]> {
  if (useSupabase) {
    const { data, error } = await supa()
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToCustomer);
  }
  return [...fileLoad().values()].sort((a, b) => b.createdAt - a.createdAt);
}

async function saveCustomer(record: CustomerRecord) {
  if (useSupabase) {
    const { error } = await supa().from('customers').upsert(customerToRow(record), { onConflict: 'email' });
    if (error) throw error;
    return;
  }
  fileLoad().set(record.email, record);
  filePersist();
}

/**
 * Register an email/password account. If a capture-only lead already exists for
 * this email it's upgraded in place; a genuine duplicate account throws.
 */
export async function createAccount(input: {
  email: string;
  name: string;
  phone: string;
  password: string;
  marketingOptIn: boolean;
}): Promise<CustomerRecord> {
  const email = normEmail(input.email);
  const existing = await getByEmail(email);
  if (existing?.registered) throw new AccountError('exists');

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hash(input.password, salt);
  const now = Date.now();

  const record: CustomerRecord = existing
    ? { ...existing, name: input.name, phone: input.phone, registered: true, passwordHash, passwordSalt: salt, marketingOptIn: input.marketingOptIn || existing.marketingOptIn }
    : { id: crypto.randomUUID(), email, name: input.name, phone: input.phone, registered: true, passwordHash, passwordSalt: salt, marketingOptIn: input.marketingOptIn, createdAt: now, orderCount: 0 };

  await saveCustomer(record);
  return record;
}

/** Verify a login. Returns the record on success, null otherwise. */
export async function verifyLogin(email: string, password: string): Promise<CustomerRecord | null> {
  const c = await getByEmail(email);
  if (!c || !c.registered || !c.passwordHash || !c.passwordSalt) return null;
  const candidate = hash(password, c.passwordSalt);
  const a = Buffer.from(candidate, 'hex');
  const b = Buffer.from(c.passwordHash, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return c;
}

/**
 * Record a customer from a placed order — the heart of the retargeting list.
 * Creates a lead if the email is new, otherwise updates contact details and
 * bumps their order stats. An existing opt-in is never silently revoked.
 */
export async function upsertLeadFromOrder(input: {
  email: string;
  name: string;
  phone: string;
  marketingOptIn: boolean;
}): Promise<CustomerRecord> {
  const email = normEmail(input.email);
  const now = Date.now();
  const existing = await getByEmail(email);

  const record: CustomerRecord = existing
    ? { ...existing, name: input.name || existing.name, phone: input.phone || existing.phone, marketingOptIn: input.marketingOptIn || existing.marketingOptIn, lastOrderAt: now, orderCount: existing.orderCount + 1 }
    : { id: crypto.randomUUID(), email, name: input.name, phone: input.phone, registered: false, marketingOptIn: input.marketingOptIn, createdAt: now, lastOrderAt: now, orderCount: 1 };

  await saveCustomer(record);
  return record;
}
