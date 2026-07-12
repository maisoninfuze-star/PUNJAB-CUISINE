'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { Logo } from '@/components/brand/Logo';
import { AccountPanel } from '@/components/auth/AccountPanel';
import { OrderHistory } from '@/components/auth/OrderHistory';
import { useAuth } from '@/components/auth/AuthProvider';
import { useI18n } from '@/lib/i18n';
import { SITE } from '@/lib/site';

export default function AccountPage() {
  const { t } = useI18n();
  const { customer } = useAuth();

  return (
    <div className="min-h-[100svh] bg-ink">
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

      <main className="container-editorial flex flex-col items-center py-16 md:py-24">
        <div className="w-full max-w-md">
          <p className="eyebrow mb-3 text-center">{t('account.pageTitle')}</p>
          <h1 className="text-center font-display text-4xl text-cream">
            {customer ? t('account.welcome') : t('account.title')}
          </h1>

          <div className="mt-10">
            <AccountPanel defaultOpen />
          </div>

          {customer && (
            <TransitionLink href="/order" className="btn-gold mt-6 flex w-full justify-center">
              {t('nav.order')}
            </TransitionLink>
          )}

          <OrderHistory />

          {!customer && <p className="mt-6 text-center text-xs text-cream/45">{t('account.orGuest')}</p>}
          <Link href="/menu" className="mt-8 block text-center text-sm text-cream/55 hover:text-gold">
            {t('order.empty.cta')}
          </Link>
        </div>
      </main>
    </div>
  );
}
