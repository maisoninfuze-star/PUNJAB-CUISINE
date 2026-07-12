'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, Trash2, Clock, ShoppingBag, Loader2 } from 'lucide-react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { Logo } from '@/components/brand/Logo';
import { DishImage } from '@/components/ui/DishImage';
import { AccountPanel } from '@/components/auth/AccountPanel';
import { useAuth } from '@/components/auth/AuthProvider';
import { useCart, selectSubtotal } from '@/lib/store/cart';
import { isValidPhone } from '@/lib/phone';
import { formatPrice } from '@/lib/utils';
import { SITE } from '@/lib/site';
import { useI18n, localizeItem } from '@/lib/i18n';

/** Next available pickup slots, in 15-min steps starting 30 min out. */
function usePickupSlots() {
  return useMemo(() => {
    const slots: { value: string; label: string }[] = [];
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30 - (now.getMinutes() % 15));
    for (let i = 0; i < 16; i++) {
      const d = new Date(now.getTime() + i * 15 * 60 * 1000);
      const label = d.toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit' });
      slots.push({ value: d.toISOString(), label });
    }
    return slots;
  }, []);
}

export default function OrderPage() {
  const { t, lang } = useI18n();
  const lines = useCart((s) => s.lines);
  const setQuantity = useCart((s) => s.setQuantity);
  const setNotes = useCart((s) => s.setNotes);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const subtotal = useCart(selectSubtotal);
  const slots = usePickupSlots();

  const { customer } = useAuth();
  const [confirmed, setConfirmed] = useState<null | { number: string; time: string }>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', pickup: '', notes: '', marketing: true });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Prefill contact details once the signed-in customer hydrates.
  useEffect(() => {
    if (!customer) return;
    setForm((prev) => ({
      ...prev,
      name: prev.name || customer.name,
      phone: prev.phone || customer.phone,
      email: prev.email || customer.email,
      marketing: customer.marketingOptIn,
    }));
  }, [customer]);

  const taxes = subtotal * 0.14975; // QC GST + QST
  const total = subtotal + taxes;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const phoneValid = isValidPhone(form.phone);
  const canSubmit = lines.length > 0 && !!form.name && phoneValid && emailValid && !!form.pickup && !busy;

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: form.name, phone: form.phone, email: form.email },
          marketingOptIn: form.marketing,
          lang,
          pickupTime: form.pickup,
          // English names go to the kitchen for consistency.
          items: lines.map((l) => ({
            id: l.item.id,
            name: l.item.name,
            price: l.item.price,
            quantity: l.quantity,
            notes: l.notes,
          })),
          note: form.notes,
        }),
      });
      if (!res.ok) throw new Error('failed');
      const { order } = await res.json();
      const time = slots.find((s) => s.value === form.pickup)?.label ?? '';
      setConfirmed({ number: order.id, time });
      clear();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError(
        lang === 'fr'
          ? 'La commande n’a pas pu être envoyée. Réessayez ou appelez-nous.'
          : 'Your order could not be sent. Please try again or call us.'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
        <div className="container-editorial flex items-center justify-between py-4">
          <TransitionLink href="/" className="flex items-center gap-2 text-sm text-cream/70 hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> {t('order.back')}
          </TransitionLink>
          <Logo variant="full" />
          <a href={`tel:${SITE.phoneHref}`} className="hidden text-sm text-cream/70 hover:text-gold sm:block">
            {SITE.phoneDisplay}
          </a>
        </div>
      </header>

      <main className="container-editorial py-12 md:py-16">
        {confirmed ? (
          <Confirmation number={confirmed.number} time={confirmed.time} />
        ) : (
          <>
            <p className="eyebrow mb-3">{t('order.eyebrow')}</p>
            <h1 className="font-display text-4xl text-cream md:text-5xl">{t('order.title')}</h1>

            {lines.length === 0 ? (
              <EmptyBasket />
            ) : (
              <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
                {/* Lines */}
                <div className="space-y-4">
                  {lines.map((line) => {
                    const l = localizeItem(line.item, lang);
                    return (
                      <div key={line.item.id} className="flex gap-4 rounded-2xl border border-white/10 bg-ink-800 p-4">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                          <DishImage src={line.item.image} alt={l.name} sizes="96px" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-display text-lg text-cream">{l.name}</h3>
                            <button
                              onClick={() => remove(line.item.id)}
                              className="text-cream/40 hover:text-ember"
                              aria-label={`Remove ${l.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <input
                            value={line.notes ?? ''}
                            onChange={(e) => setNotes(line.item.id, e.target.value)}
                            placeholder={t('order.notePlaceholder')}
                            className="mt-1 w-full bg-transparent text-sm text-cream/70 placeholder:text-cream/35 focus:outline-none"
                          />
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center gap-1 rounded-full border border-white/10">
                              <button
                                onClick={() => setQuantity(line.item.id, line.quantity - 1)}
                                className="flex h-8 w-8 items-center justify-center text-cream/70 hover:text-gold"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm text-cream">{line.quantity}</span>
                              <button
                                onClick={() => setQuantity(line.item.id, line.quantity + 1)}
                                className="flex h-8 w-8 items-center justify-center text-cream/70 hover:text-gold"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <span className="font-sans text-sm text-gold">
                              {formatPrice(line.item.price * line.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary + pickup form */}
                <form
                  onSubmit={placeOrder}
                  className="h-fit space-y-5 rounded-2xl border border-white/10 bg-ink-800 p-6 lg:sticky lg:top-24"
                >
                  <h2 className="font-display text-2xl text-cream">{t('order.details')}</h2>

                  <AccountPanel />

                  <div className="space-y-3">
                    <Field label={t('order.name')} required>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-dark" placeholder={t('order.name')} />
                    </Field>
                    <Field label={t('order.phone')} required>
                      <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-dark" placeholder="(514) 555-0000" aria-invalid={!!form.phone && !phoneValid} />
                      {!!form.phone && !phoneValid && (
                        <p className="mt-1 text-xs text-rose-400">{t('order.phoneInvalid')}</p>
                      )}
                    </Field>
                    <Field label={t('order.email')} required>
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-dark" placeholder="you@email.com" />
                    </Field>
                    <Field label={t('order.pickupTime')} required>
                      <div className="relative">
                        <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/40" />
                        <select required value={form.pickup} onChange={(e) => setForm({ ...form, pickup: e.target.value })} className="input-dark appearance-none pl-9">
                          <option value="" disabled>{t('order.chooseTime')}</option>
                          {slots.map((s, i) => (
                            <option key={s.value} value={s.value}>
                              {s.label}{i === 0 ? ` (${t('order.soonest')})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Field>
                  </div>

                  <div className="space-y-2 border-t border-white/10 pt-4 text-sm">
                    <Row label={t('order.subtotal')} value={formatPrice(subtotal)} />
                    <Row label={t('order.taxes')} value={formatPrice(taxes)} muted />
                    <Row label={t('order.total')} value={formatPrice(total)} bold />
                  </div>

                  <label className="flex cursor-pointer items-start gap-2.5 text-xs text-cream/60">
                    <input
                      type="checkbox"
                      checked={form.marketing}
                      onChange={(e) => setForm({ ...form, marketing: e.target.checked })}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-gold"
                    />
                    <span>{t('order.marketing')}</span>
                  </label>

                  {error && <p className="text-sm text-rose-400">{error}</p>}

                  <button type="submit" disabled={!canSubmit} className="btn-gold w-full disabled:cursor-not-allowed disabled:opacity-40">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : t('order.place')}
                  </button>
                  <p className="text-center text-xs text-cream/45">{t('order.noPay')}</p>
                </form>
              </div>
            )}
          </>
        )}
      </main>

      <style jsx global>{`
        .input-dark {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: #0a0a0a;
          padding: 0.7rem 0.9rem;
          font-size: 0.9rem;
          color: #f5f2ec;
        }
        .input-dark::placeholder { color: rgba(245, 242, 236, 0.35); }
        .input-dark:focus { outline: none; border-color: rgba(201, 168, 76, 0.5); }
      `}</style>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-cream/50">
        {label} {required && <span className="text-gold">*</span>}
      </span>
      {children}
    </label>
  );
}

function Row({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={muted ? 'text-cream/50' : bold ? 'font-medium text-cream' : 'text-cream/70'}>{label}</span>
      <span className={bold ? 'font-display text-lg text-gold' : muted ? 'text-cream/50' : 'text-cream'}>{value}</span>
    </div>
  );
}

function EmptyBasket() {
  const { t } = useI18n();
  return (
    <div className="mt-16 flex flex-col items-center rounded-2xl border border-dashed border-white/15 py-20 text-center">
      <ShoppingBag className="h-10 w-10 text-cream/30" />
      <p className="mt-4 font-display text-2xl text-cream">{t('order.empty.title')}</p>
      <p className="mt-2 max-w-sm text-sm text-cream/55">{t('order.empty.body')}</p>
      <Link href="/menu" className="btn-gold mt-8">{t('order.empty.cta')}</Link>
    </div>
  );
}

function Confirmation({ number, time }: { number: string; time: string }) {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
        <span className="font-display text-3xl text-gold">✓</span>
      </div>
      <h1 className="mt-8 font-display text-4xl text-cream">{t('order.confirmTitle')}</h1>
      <p className="mt-3 text-cream/65">{t('order.confirmBody')}</p>

      <div className="mt-10 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-ink-800 p-6">
          <p className="text-xs uppercase tracking-wide text-cream/50">{t('order.number')}</p>
          <p className="mt-2 font-display text-3xl text-gold">{number}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink-800 p-6">
          <p className="text-xs uppercase tracking-wide text-cream/50">{t('order.pickupAt')}</p>
          <p className="mt-2 font-display text-3xl text-cream">{time}</p>
        </div>
      </div>

      <p className="mt-8 text-sm text-cream/55">{t('order.confirmNote')}</p>
      <Link href="/" className="btn-ghost mt-8">{t('order.home')}</Link>
    </div>
  );
}
