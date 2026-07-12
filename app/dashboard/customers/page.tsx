'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Search, Users, Loader2, Mail } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';

const KEY_STORAGE = 'pc-owner-key';

interface Row {
  id: string;
  email: string;
  name: string;
  phone: string;
  registered: boolean;
  marketingOptIn: boolean;
  orderCount: number;
  createdAt: number;
  lastOrderAt: number | null;
}

export default function CustomersPage() {
  const [key, setKey] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [optedOnly, setOptedOnly] = useState(false);

  useEffect(() => { setKey(localStorage.getItem(KEY_STORAGE)); }, []);

  const load = useCallback(async (k: string) => {
    setErr('');
    try {
      const res = await fetch('/api/customers', { headers: { 'x-owner-key': k } });
      if (res.status === 401) { setErr('unauthorized'); return; }
      const data = await res.json();
      setRows(data.customers ?? []);
    } catch {
      setErr('network');
    }
  }, []);

  useEffect(() => { if (key) load(key); }, [key, load]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    return rows.filter((r) => {
      if (optedOnly && !r.marketingOptIn) return false;
      if (!q) return true;
      const s = q.toLowerCase();
      return r.email.toLowerCase().includes(s) || r.name.toLowerCase().includes(s) || r.phone.includes(s);
    });
  }, [rows, q, optedOnly]);

  const optedCount = useMemo(() => (rows ?? []).filter((r) => r.marketingOptIn).length, [rows]);

  if (key === null) {
    return (
      <Shell>
        <p className="text-cream/70">
          Please <Link href="/dashboard" className="text-gold underline">sign in to the dashboard</Link> first.
        </p>
      </Shell>
    );
  }

  if (err === 'unauthorized') {
    return (
      <Shell>
        <p className="text-rose-300">Session expired. <Link href="/dashboard" className="text-gold underline">Sign in again.</Link></p>
      </Shell>
    );
  }

  const exportHref = (opted: boolean) =>
    `/api/customers/export?key=${encodeURIComponent(key)}${opted ? '&optedIn=1' : ''}`;

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 font-display text-3xl text-cream">
            <Users className="h-6 w-6 text-gold" /> Customers
          </h1>
          <p className="mt-1 text-sm text-cream/55">
            {rows ? `${rows.length} total · ${optedCount} opted in to marketing` : 'Loading…'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={exportHref(true)} className="btn-gold inline-flex items-center gap-2">
            <Download className="h-4 w-4" /> Export opt-ins ({optedCount})
          </a>
          <a href={exportHref(false)} className="btn-ghost inline-flex items-center gap-2">
            <Download className="h-4 w-4" /> Export all
          </a>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search email, name or phone…"
            className="w-full rounded-xl border border-white/10 bg-ink-800 py-2.5 pl-9 pr-3 text-sm text-cream placeholder:text-cream/35 focus:border-gold/50 focus:outline-none"
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-cream/70">
          <input type="checkbox" checked={optedOnly} onChange={(e) => setOptedOnly(e.target.checked)} className="h-4 w-4 accent-gold" />
          Marketing opt-ins only
        </label>
      </div>

      {!rows ? (
        <div className="flex items-center gap-2 py-16 text-cream/50"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-sm text-cream/40">
          No customers yet — they’ll appear here as orders come in.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wide text-cream/45">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Marketing</th>
                <th className="px-4 py-3 text-right font-medium">Orders</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3">
                    <a href={`mailto:${r.email}`} className="flex items-center gap-1.5 text-cream hover:text-gold">
                      <Mail className="h-3.5 w-3.5 text-cream/40" /> {r.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-cream/85">{r.name}</td>
                  <td className="px-4 py-3 text-cream/60">{r.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[0.65rem] uppercase tracking-wide ${r.registered ? 'bg-gold/15 text-gold' : 'bg-white/10 text-cream/55'}`}>
                      {r.registered ? 'Account' : 'Guest'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {r.marketingOptIn
                      ? <span className="text-emerald-300">Opted in</span>
                      : <span className="text-cream/40">No</span>}
                  </td>
                  <td className="px-4 py-3 text-right text-cream/70">{r.orderCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100svh] bg-ink pb-20">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <Logo />
            <Link href="/dashboard" className="flex items-center gap-1.5 border-l border-white/10 pl-4 text-sm text-cream/70 hover:text-gold">
              <ArrowLeft className="h-4 w-4" /> Kitchen
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-6 py-8">{children}</main>
    </div>
  );
}
