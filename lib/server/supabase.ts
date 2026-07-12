/**
 * Server-only Supabase client. Uses the SERVICE ROLE key, so it bypasses RLS —
 * NEVER import this into client components. When the env vars are absent (local
 * dev without a Supabase project) `useSupabase` is false and the stores fall
 * back to the file-backed implementation, so the app still runs.
 *
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...   (Project Settings → API → service_role)
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Sanitize common copy-paste mistakes: trailing slash, or an accidental
// "/rest/v1" suffix. The base URL must be exactly https://<ref>.supabase.co.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/(rest\/v1)?\/*$/, '');
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

/** True when a Supabase project is configured (production path). */
export const useSupabase = Boolean(url && serviceKey);

let client: SupabaseClient | null = null;

/** Lazily-created singleton service-role client. */
export function supa(): SupabaseClient {
  if (!client) {
    if (!url || !serviceKey) throw new Error('Supabase env not configured');
    client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
