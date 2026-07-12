'use client';

import { useState } from 'react';
import { User, LogOut, ChevronDown, Loader2 } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { useI18n } from '@/lib/i18n';

const inputCls =
  'w-full rounded-xl border border-white/10 bg-ink px-3.5 py-2.5 text-sm text-cream placeholder:text-cream/35 focus:border-gold/50 focus:outline-none';

/**
 * Compact account panel for the checkout (and the /account page). Shows the
 * signed-in customer, or a collapsible login / sign-up form. Accounts are
 * optional — guests can always check out.
 */
export function AccountPanel({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const { t } = useI18n();
  const { customer, loading, login, signup, logout } = useAuth();
  const [open, setOpen] = useState(defaultOpen);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [f, setF] = useState({ email: '', password: '', name: '', phone: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const errText = (code?: string) =>
    (code && t(`account.err.${code}`) !== `account.err.${code}` ? t(`account.err.${code}`) : t('account.err.generic'));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res =
      mode === 'login'
        ? await login(f.email, f.password)
        : await signup({ email: f.email, name: f.name, phone: f.phone, password: f.password, marketingOptIn: true });
    setBusy(false);
    if (res.ok) {
      setOpen(false);
      setF({ email: '', password: '', name: '', phone: '' });
    } else {
      setError(errText(res.error));
    }
  }

  if (loading) {
    return <div className="h-12 animate-pulse rounded-2xl border border-white/10 bg-ink-800/50" />;
  }

  if (customer) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-gold/25 bg-gold/[0.06] px-4 py-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
            <User className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm text-cream">
              {t('account.signedInAs')} <span className="text-gold">{customer.name}</span>
            </p>
            <p className="truncate text-xs text-cream/50">{customer.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => logout()}
          className="flex shrink-0 items-center gap-1.5 text-xs text-cream/55 transition-colors hover:text-gold"
        >
          <LogOut className="h-3.5 w-3.5" /> {t('account.logout')}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-ink-800">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2.5 text-sm text-cream/80">
          <User className="h-4 w-4 text-gold" />
          {t('account.saveCta')}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-cream/50 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <form onSubmit={submit} className="space-y-2.5 border-t border-white/10 p-4">
          {mode === 'signup' && (
            <>
              <input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={inputCls} placeholder={t('account.name')} autoComplete="name" />
              <input required type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className={inputCls} placeholder={t('account.phone')} autoComplete="tel" />
            </>
          )}
          <input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className={inputCls} placeholder={t('account.email')} autoComplete="email" />
          <input required type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} className={inputCls} placeholder={mode === 'signup' ? t('account.passwordHint') : t('account.password')} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={6} />

          {error && <p className="text-xs text-rose-400">{error}</p>}

          <button type="submit" disabled={busy} className="btn-gold w-full disabled:opacity-40">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === 'login' ? t('account.login') : t('account.signup')}
          </button>
          <button
            type="button"
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
            className="w-full text-center text-xs text-cream/55 transition-colors hover:text-gold"
          >
            {mode === 'login' ? t('account.toSignup') : t('account.toLogin')}
          </button>
        </form>
      )}
    </div>
  );
}
