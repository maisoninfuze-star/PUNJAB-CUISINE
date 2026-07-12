'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  BellOff,
  Check,
  X,
  ChefHat,
  Printer,
  Clock,
  Phone,
  LogOut,
  Loader2,
  Users,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { formatPrice } from '@/lib/utils';
import {
  type Order,
  type OrderStatus,
  STATUS_META,
} from '@/lib/orders';
import { primeAudio, playAlert, isAudioReady, requestNotify, notifyNewOrder } from '@/components/dashboard/sound';
import { printOrder } from '@/components/dashboard/printOrder';

const KEY_STORAGE = 'pc-owner-key';

export default function DashboardPage() {
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    setKey(localStorage.getItem(KEY_STORAGE));
  }, []);

  if (key === null) return <LoginGate onAuthed={setKey} />;
  return <Kitchen ownerKey={key} onLogout={() => { localStorage.removeItem(KEY_STORAGE); setKey(null); }} />;
}

/* ─────────────────────────── Login ─────────────────────────── */

function LoginGate({ onAuthed }: { onAuthed: (key: string) => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    primeAudio(); // gesture → unlock kitchen sound
    try {
      const res = await fetch('/api/orders', { headers: { 'x-owner-key': value } });
      if (res.ok) {
        localStorage.setItem(KEY_STORAGE, value);
        onAuthed(value);
      } else {
        setError('Incorrect passcode.');
      }
    } catch {
      setError('Could not reach the server.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-ink px-6">
      <form onSubmit={submit} className="w-full max-w-sm text-center">
        <div className="mx-auto mb-8 flex justify-center">
          <Logo stacked />
        </div>
        <h1 className="font-display text-3xl text-cream">Kitchen Dashboard</h1>
        <p className="mt-2 text-sm text-cream/55">Owner access only.</p>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Passcode"
          className="mt-8 w-full rounded-xl border border-white/15 bg-ink-800 px-4 py-3 text-center text-cream placeholder:text-cream/30 focus:border-gold/60 focus:outline-none"
        />
        {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
        <button type="submit" disabled={busy || !value} className="btn-gold mt-6 w-full disabled:opacity-40">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enter kitchen'}
        </button>
      </form>
    </div>
  );
}

/* ─────────────────────────── Kitchen ─────────────────────────── */

const COLUMNS: { key: string; title: string; statuses: OrderStatus[] }[] = [
  { key: 'new', title: 'New orders', statuses: ['pending'] },
  { key: 'progress', title: 'In the kitchen', statuses: ['accepted', 'preparing'] },
  { key: 'ready', title: 'Ready for pickup', statuses: ['ready'] },
];

function Kitchen({ ownerKey, onLogout }: { ownerKey: string; onLogout: () => void }) {
  const [orders, setOrders] = useState<Record<string, Order>>({});
  const [connected, setConnected] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [audioReady, setAudioReady] = useState(false);
  const soundRef = useRef(soundOn);
  soundRef.current = soundOn;

  // Unlock kitchen audio. When the owner arrives with a stored passcode the
  // LoginGate (and its priming click) is skipped, so the AudioContext would
  // stay suspended and the new-order chime silent until a manual interaction.
  // Prime eagerly on mount, and again on the first gesture anywhere as a
  // fallback for browsers that require one. `audioReady` drives the banner that
  // nudges staff to click if the browser is still blocking sound.
  useEffect(() => {
    const sync = () => setAudioReady(isAudioReady());
    primeAudio();
    sync();
    requestNotify();
    const unlock = () => { primeAudio(); sync(); };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    const id = setInterval(sync, 2000); // context can suspend when tab is hidden
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      clearInterval(id);
    };
  }, []);

  // Live feed via SSE.
  useEffect(() => {
    const es = new EventSource(`/api/orders/stream?key=${encodeURIComponent(ownerKey)}`);
    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);
    es.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'snapshot') {
        const map: Record<string, Order> = {};
        for (const o of msg.orders as Order[]) map[o.id] = o;
        setOrders(map);
      } else if (msg.type === 'created') {
        setOrders((prev) => ({ ...prev, [msg.order.id]: msg.order }));
        if (soundRef.current) playAlert();
        notifyNewOrder(
          `New order ${msg.order.id}`,
          `${msg.order.customer?.name ?? ''} · ${formatPrice(msg.order.total)}`
        );
      } else if (msg.type === 'updated') {
        setOrders((prev) => ({ ...prev, [msg.order.id]: msg.order }));
      }
    };
    return () => es.close();
  }, [ownerKey]);

  const all = useMemo(
    () => Object.values(orders).sort((a, b) => a.createdAt - b.createdAt),
    [orders]
  );
  const pendingCount = all.filter((o) => o.status === 'pending').length;

  // Re-ring every 12s while unaccepted orders wait.
  useEffect(() => {
    if (!soundOn || pendingCount === 0) return;
    const id = setInterval(() => playAlert(), 12000);
    return () => clearInterval(id);
  }, [soundOn, pendingCount]);

  // Flash the browser tab title while orders wait — a visual alert even when
  // the dashboard tab is in the background.
  useEffect(() => {
    const base = 'Punjabi Kitchen';
    if (pendingCount === 0) { document.title = base; return; }
    let on = false;
    const flip = () => {
      on = !on;
      document.title = on ? `🔔 ${pendingCount} new order${pendingCount > 1 ? 's' : ''}!` : base;
    };
    flip();
    const id = setInterval(flip, 1000);
    return () => { clearInterval(id); document.title = base; };
  }, [pendingCount]);

  const setStatus = useCallback(
    async (id: string, status: OrderStatus) => {
      setOrders((prev) =>
        prev[id] ? { ...prev, [id]: { ...prev[id], status } } : prev
      );
      await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-owner-key': ownerKey },
        body: JSON.stringify({ status }),
      }).catch(() => {});
    },
    [ownerKey]
  );

  // Today's stats.
  const stats = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const today = all.filter((o) => o.createdAt >= start.getTime());
    const completed = today.filter((o) => o.status === 'completed');
    const revenue = today
      .filter((o) => o.status !== 'cancelled')
      .reduce((s, o) => s + o.total, 0);
    const avgPrep =
      completed.length > 0
        ? completed.reduce((s, o) => s + (o.updatedAt - o.createdAt), 0) /
          completed.length /
          60000
        : 0;
    return { count: today.length, revenue, avgPrep };
  }, [all]);

  return (
    <div className="min-h-[100svh] bg-ink pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="hidden border-l border-white/10 pl-4 sm:block">
              <p className="font-display text-lg leading-none text-cream">Kitchen</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-cream/50">
                <span className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                {connected ? 'Live' : 'Reconnecting…'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Stat label="Orders today" value={String(stats.count)} />
            <Stat label="Revenue" value={formatPrice(stats.revenue)} />
            <Stat label="Avg prep" value={`${stats.avgPrep.toFixed(0)} min`} />
            <Link
              href="/dashboard/customers"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-cream/70 transition-colors hover:border-gold hover:text-gold"
              aria-label="Customers"
              title="Customers & marketing list"
            >
              <Users className="h-4 w-4" />
            </Link>
            <button
              onClick={() => { primeAudio(); setSoundOn((s) => !s); }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-cream/70 transition-colors hover:border-gold hover:text-gold"
              aria-label={soundOn ? 'Mute alerts' : 'Enable alerts'}
              title={soundOn ? 'Mute alerts' : 'Enable alerts'}
            >
              {soundOn ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            </button>
            <button
              onClick={onLogout}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-cream/70 transition-colors hover:border-rose-400/60 hover:text-rose-300"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Sound-blocked nudge — browsers mute audio until the page is clicked. */}
      {soundOn && !audioReady && (
        <button
          onClick={() => { primeAudio(); setAudioReady(isAudioReady()); requestNotify(); }}
          className="flex w-full items-center justify-center gap-2 bg-amber-500/15 py-2.5 text-sm font-medium text-amber-300 transition-colors hover:bg-amber-500/25"
        >
          <Bell className="h-4 w-4" /> Tap here to turn on new-order sounds
        </button>
      )}

      {/* Columns */}
      <div className="mx-auto grid max-w-[1600px] gap-5 px-6 py-6 lg:grid-cols-3">
        {COLUMNS.map((col) => {
          const list = all.filter((o) => col.statuses.includes(o.status));
          return (
            <section key={col.key} className="flex flex-col">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl text-cream">{col.title}</h2>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-sm text-cream/60">
                  {list.length}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {list.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-white/10 py-10 text-center text-sm text-cream/30">
                    Nothing here yet
                  </p>
                )}
                {list.map((o) => (
                  <OrderCard key={o.id} order={o} onStatus={setStatus} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="hidden flex-col items-end border-r border-white/10 pr-3 last:border-0 md:flex">
      <span className="font-display text-lg leading-none text-gold">{value}</span>
      <span className="mt-0.5 text-[0.65rem] uppercase tracking-wide text-cream/40">{label}</span>
    </div>
  );
}

/* ─────────────────────────── Order card ─────────────────────────── */

function timeAgo(ts: number) {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return 'just now';
  if (mins === 1) return '1 min ago';
  if (mins < 60) return `${mins} min ago`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
}

function OrderCard({ order, onStatus }: { order: Order; onStatus: (id: string, s: OrderStatus) => void }) {
  const [, force] = useState(0);
  // Refresh the relative time each minute.
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const meta = STATUS_META[order.status];
  const pickup = new Date(order.pickupTime).toLocaleTimeString('en-CA', {
    hour: 'numeric',
    minute: '2-digit',
  });
  const isNew = order.status === 'pending';

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-ink-800 transition-colors ${
        isNew ? 'border-gold/60 shadow-[0_0_0_1px_rgba(201,168,76,0.25)]' : 'border-white/10'
      }`}
    >
      {/* Card head */}
      <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-xl text-cream">{order.id}</span>
            <span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide ${toneClass(meta.tone)}`}>
              {meta.en}
            </span>
          </div>
          <p className="mt-1 text-xs text-cream/45">{timeAgo(order.createdAt)}</p>
        </div>
        <div className="text-right">
          <p className="flex items-center justify-end gap-1 text-sm text-cream">
            <Clock className="h-3.5 w-3.5 text-gold" /> {pickup}
          </p>
          <p className="mt-1 font-display text-lg text-gold">{formatPrice(order.total)}</p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2 p-4">
        {order.items.map((l) => (
          <div key={l.id} className="flex justify-between gap-3 text-sm">
            <span className="text-cream/85">
              <span className="text-gold">{l.quantity}×</span> {l.name}
              {l.notes && <span className="mt-0.5 block text-xs italic text-cream/45">“{l.notes}”</span>}
            </span>
            <span className="shrink-0 text-cream/50">{formatPrice(l.price * l.quantity)}</span>
          </div>
        ))}
      </div>

      {/* Customer */}
      <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3 text-sm">
        <span className="text-cream/80">{order.customer.name}</span>
        <a href={`tel:${order.customer.phone}`} className="flex items-center gap-1 text-cream/55 hover:text-gold">
          <Phone className="h-3.5 w-3.5" /> {order.customer.phone}
        </a>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 border-t border-white/10 p-3">
        {order.status === 'pending' && (
          <>
            <Action primary icon={<Check className="h-4 w-4" />} onClick={() => onStatus(order.id, 'accepted')}>
              Accept
            </Action>
            <Action danger icon={<X className="h-4 w-4" />} onClick={() => onStatus(order.id, 'cancelled')}>
              Deny
            </Action>
          </>
        )}
        {order.status === 'accepted' && (
          <Action primary icon={<ChefHat className="h-4 w-4" />} onClick={() => onStatus(order.id, 'preparing')}>
            Start preparing
          </Action>
        )}
        {order.status === 'preparing' && (
          <Action primary icon={<Check className="h-4 w-4" />} onClick={() => onStatus(order.id, 'ready')}>
            Mark ready
          </Action>
        )}
        {order.status === 'ready' && (
          <Action primary icon={<Check className="h-4 w-4" />} onClick={() => onStatus(order.id, 'completed')}>
            Complete
          </Action>
        )}
        {order.status !== 'pending' && order.status !== 'completed' && order.status !== 'cancelled' && (
          <Action danger icon={<X className="h-4 w-4" />} onClick={() => onStatus(order.id, 'cancelled')}>
            Cancel
          </Action>
        )}
        <Action icon={<Printer className="h-4 w-4" />} onClick={() => printOrder(order)}>
          Print
        </Action>
      </div>
    </article>
  );
}

function Action({
  children,
  icon,
  onClick,
  primary,
  danger,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  danger?: boolean;
}) {
  const cls = primary
    ? 'bg-gold text-ink hover:bg-gold-light'
    : danger
      ? 'border border-rose-400/40 text-rose-300 hover:bg-rose-500/10'
      : 'border border-white/15 text-cream/70 hover:border-gold hover:text-gold';
  return (
    <button
      onClick={onClick}
      className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${cls}`}
    >
      {icon} {children}
    </button>
  );
}

function toneClass(tone: string) {
  switch (tone) {
    case 'gold': return 'bg-gold/20 text-gold';
    case 'sky': return 'bg-sky-500/15 text-sky-300';
    case 'amber': return 'bg-amber-500/15 text-amber-300';
    case 'emerald': return 'bg-emerald-500/15 text-emerald-300';
    case 'rose': return 'bg-rose-500/15 text-rose-300';
    default: return 'bg-white/10 text-cream/60';
  }
}
