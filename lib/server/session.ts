/**
 * Stateless signed-cookie sessions. A token is `<payload>.<sig>` where payload
 * is base64url(JSON{sub,exp}) and sig is an HMAC-SHA256 over the payload keyed
 * by AUTH_SECRET. No server-side session table needed.
 *
 * Set AUTH_SECRET in production; a dev fallback keeps things working locally.
 */
import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { getById, type CustomerRecord } from './customer-store';

export const SESSION_COOKIE = 'pc-session';
const MAX_AGE_DAYS = 30;

const SECRET =
  process.env.AUTH_SECRET ||
  process.env.OWNER_PASSCODE || // reuse if set, still better than a constant
  'pc-dev-insecure-secret-change-me';

const b64url = (b: Buffer) => b.toString('base64url');

function sign(payload: string) {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
}

function createToken(customerId: string): string {
  const exp = Date.now() + MAX_AGE_DAYS * 86_400_000;
  const payload = b64url(Buffer.from(JSON.stringify({ sub: customerId, exp })));
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined): { sub: string } | null {
  if (!token || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (typeof data.sub !== 'string' || typeof data.exp !== 'number') return null;
    if (data.exp < Date.now()) return null;
    return { sub: data.sub };
  } catch {
    return null;
  }
}

/** Set the session cookie for a customer (call from a Route Handler). */
export function startSession(customerId: string) {
  cookies().set(SESSION_COOKIE, createToken(customerId), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_DAYS * 86_400,
  });
}

/** Clear the session cookie. */
export function endSession() {
  cookies().set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
}

/** Resolve the signed-in customer from the request cookies, or null. */
export async function currentCustomer(): Promise<CustomerRecord | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const parsed = verifyToken(token);
  if (!parsed) return null;
  return (await getById(parsed.sub)) ?? null;
}
