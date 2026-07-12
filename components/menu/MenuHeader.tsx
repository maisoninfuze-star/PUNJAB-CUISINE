'use client';

import { ArrowLeft, Phone } from 'lucide-react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { LangToggle } from '@/components/ui/LangToggle';
import { Logo } from '@/components/brand/Logo';
import { SITE } from '@/lib/site';
import { useI18n } from '@/lib/i18n';

/** Sticky chrome shared by every /menu page. */
export function MenuHeader() {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
      <div className="container-editorial flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-4">
          <TransitionLink
            href="/"
            className="flex items-center gap-1.5 text-sm text-cream/70 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> {t('menu.home')}
          </TransitionLink>
          <span className="hidden h-4 w-px bg-white/15 sm:block" />
          <TransitionLink href="/menu" className="hidden sm:block">
            <Logo variant="full" />
          </TransitionLink>
        </div>

        <div className="flex items-center gap-3">
          <LangToggle className="hidden md:inline-flex" />
          <a
            href={`tel:${SITE.phoneHref}`}
            className="hidden items-center gap-2 text-sm text-cream/70 transition-colors hover:text-gold lg:flex"
          >
            <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
          </a>
          <TransitionLink href="/order" className="btn-gold">
            {t('nav.order')}
          </TransitionLink>
        </div>
      </div>
    </header>
  );
}
