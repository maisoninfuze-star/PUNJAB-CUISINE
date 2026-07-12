/**
 * Server-only customer + lead store. Backs email/password accounts AND the
 * marketing (retargeting) list. Self-contained and dependency-free, persisted
 * to .data/customers.json — same pattern as the order store. Swap for
 * Supabase/Postgres later; the exported functions are the whole surface.
 *
 * Passwords are hashed with Node's built-in scrypt (salted, timing-safe
 * compare). Plain passwords are never stored or logged.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { PublicCustomer } from '@/lib/customer';

export interface CustomerRecord {
  id: string;
  email: string; // lowercased — the unique key
  name: string;
  phone: string;
  passwordHash?: string; // hex; absent for capture-only guest leads
  passwordSalt?: string; // hex
  registered: boolean;
  marketingOptIn: boolean;
  createdAt: number;
  lastOrderAt?: number;
  orderCount: number;
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'customers.json');

// Survive HMR / route-module reloads by stashing on globalThis.
const g = globalThis as unknown as { __pcCustomers?: Map<string, CustomerRecord> };

function load(): Map<string, CustomerRecord> {
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

function persist() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify([...load().values()], null, 2));
  } catch {
    /* best-effort */
  }
}

const normEmail = (e: string) => e.trim().toLowerCase();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isValidEmail = (e: string) => EMAIL_RE.test(normEmail(e));

function hash(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

/** Strip secrets before anything leaves the server. */
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

export function getByEmail(email: string): CustomerRecord | undefined {
  return load().get(normEmail(email));
}

export function getById(id: string): CustomerRecord | undefined {
  for (const c of load().values()) if (c.id === id) return c;
  return undefined;
}

export function listCustomers(): CustomerRecord[] {
  return [...load().values()].sort((a, b) => b.createdAt - a.createdAt);
}

export class AccountError extends Error {}

/**
 * Register an email/password account. If a capture-only lead already exists for
 * this email it's upgraded in place; a genuine duplicate account throws.
 */
export function createAccount(input: {
  email: string;
  name: string;
  phone: string;
  password: string;
  marketingOptIn: boolean;
}): CustomerRecord {
  const email = normEmail(input.email);
  const map = load();
  const existing = map.get(email);
  if (existing?.registered) throw new AccountError('exists');

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hash(input.password, salt);
  const now = Date.now();

  const record: CustomerRecord = existing
    ? { ...existing, name: input.name, phone: input.phone, registered: true, passwordHash, passwordSalt: salt, marketingOptIn: input.marketingOptIn || existing.marketingOptIn }
    : { id: crypto.randomUUID(), email, name: input.name, phone: input.phone, registered: true, passwordHash, passwordSalt: salt, marketingOptIn: input.marketingOptIn, createdAt: now, orderCount: 0 };

  map.set(email, record);
  persist();
  return record;
}

/** Verify a login. Returns the record on success, null otherwise. */
export function verifyLogin(email: string, password: string): CustomerRecord | null {
  const c = getByEmail(email);
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
export function upsertLeadFromOrder(input: {
  email: string;
  name: string;
  phone: string;
  marketingOptIn: boolean;
}): CustomerRecord {
  const email = normEmail(input.email);
  const map = load();
  const now = Date.now();
  const existing = map.get(email);

  const record: CustomerRecord = existing
    ? { ...existing, name: input.name || existing.name, phone: input.phone || existing.phone, marketingOptIn: input.marketingOptIn || existing.marketingOptIn, lastOrderAt: now, orderCount: existing.orderCount + 1 }
    : { id: crypto.randomUUID(), email, name: input.name, phone: input.phone, registered: false, marketingOptIn: input.marketingOptIn, createdAt: now, lastOrderAt: now, orderCount: 1 };

  map.set(email, record);
  persist();
  return record;
}
