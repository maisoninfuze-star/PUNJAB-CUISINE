'use client';

import { useEffect, useState } from 'react';
import { Loader2, Clock } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { useI18n } from '@/lib/i18n';
import { formatPrice } from '@/lib/utils';
import { STATUS_META, type Order } from '@/lib/orders';

/** The signed-in customer's past pickup orders. Renders nothing when logged out. */
export function OrderHistory() {
  const { customer } = useAuth();
  const { t, lang } = useI18n();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!customer) { setOrders(null); return; }
    let alive = true;
    fetch('/api/orders/mine')
      .then((r) => (r.ok ? r.json() : { orders: [] }))
      .then((d) => { if (alive) setOrders(d.orders ?? []); })
      .catch(() => { if (alive) setOrders([]); });
    return () => { alive = false; };
  }, [customer]);

  if (!customer) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-3 font-display text-xl text-cream">{t('account.orders.title')}</h2>

      {orders === null ? (
        <div className="flex items-center gap-2 py-8 text-sm text-cream/50">
          <Loader2 className="h-4 w-4 animate-spin" /> {t('account.orders.loading')}
        </div>
      ) : orders.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/10 py-10 text-center text-sm text-cream/40">
          {t('account.orders.empty')}
        </p>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => {
            const meta = STATUS_META[o.status];
            const date = new Date(o.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
            const pickup = new Date(o.pickupTime).toLocaleTimeString(lang === 'fr' ? 'fr-CA' : 'en-CA', {
              hour: 'numeric',
              minute: '2-digit',
            });
            return (
              <li key={o.id} className="rounded-2xl border border-white/10 bg-ink-800 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2">
                      <span className="font-display text-lg text-cream">{o.id}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[0.65rem] uppercase tracking-wide ${toneClass(meta.tone)}`}>
                        {lang === 'fr' ? meta.fr : meta.en}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-cream/45">
                      {date} · <Clock className="mb-0.5 inline h-3 w-3" /> {pickup}
                    </p>
                  </div>
                  <span className="font-display text-lg text-gold">{formatPrice(o.total)}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-cream/60">
                  {o.items.map((l) => `${l.quantity}× ${l.name}`).join(' · ')}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
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
