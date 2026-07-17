'use client';

import { useEffect, useState } from 'react';
import { Instagram } from 'lucide-react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { Logo } from '@/components/brand/Logo';
import { NAV_LINKS, SITE } from '@/lib/site';
import { useI18n } from '@/lib/i18n';

/** Live Montréal time, ticking each second (balky-style footer detail). */
function LiveClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat('en-CA', {
          timeZone: 'America/Toronto',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-sans tabular-nums tracking-wide text-cream/70">
      {time || '--:--:--'} <span className="text-cream/40">(MTL)</span>
    </span>
  );
}

const TAGLINES: Record<'en' | 'fr', string[]> = {
  en: ['Tandoor-Fired', 'Slow-Cooked', 'Punjab to Montréal'],
  fr: ['Cuit au tandoor', 'Mijoté lentement', 'Du Punjab à Montréal'],
};

export function Footer() {
  const { t, lang } = useI18n();
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink">
      {/* Big enquiry band */}
      <div className="container-editorial border-b border-white/10 py-20 md:py-28">
        <p className="eyebrow mb-8">{t('footer.eyebrow')}</p>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="font-display text-5xl font-semibold uppercase leading-[0.9] tracking-[-0.02em] text-cream md:text-8xl">
            {t('footer.reserve1')}
            <br />
            <span className="font-accent italic capitalize text-gold">{t('footer.reserve2')}</span>
          </h2>
          <div className="flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-end">
            <a href={`tel:${SITE.phoneHref}`} className="btn-gold">
              {t('footer.call')} {SITE.phoneDisplay}
            </a>
            <TransitionLink href="/order" className="btn-ghost">
              {t('footer.order')}
            </TransitionLink>
          </div>
        </div>

        {/* Repeated taglines */}
        <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2">
          {TAGLINES[lang].map((word, i) => (
            <span key={word} className="flex items-center gap-6">
              <span className="font-display text-lg italic text-cream/40 md:text-xl">{word}</span>
              {i < TAGLINES[lang].length - 1 && <span className="text-gold/60">✦</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Lower grid */}
      <div className="container-editorial pb-28 pt-14">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo variant="full" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/55">
              {t('footer.blurb')}
            </p>
          </div>

          <div>
            <p className="eyebrow mb-5">{t('footer.explore')}</p>
            <ul className="space-y-3 text-sm uppercase tracking-wide">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-cream/70 transition-colors hover:text-gold">
                    {t(l.key)}
                  </a>
                </li>
              ))}
              <li>
                <TransitionLink href="/order" className="text-cream/70 transition-colors hover:text-gold">
                  {t('footer.order')}
                </TransitionLink>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-5">{t('footer.visit')}</p>
            <address className="space-y-3 text-sm not-italic text-cream/70">
              <p>
                {SITE.address.street}
                <br />
                {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
              </p>
              <p>
                <a href={`mailto:${SITE.email}`} className="hover:text-gold">
                  {SITE.email}
                </a>
              </p>
              <div className="flex gap-3 pt-2">
                <a
                  href={SITE.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-cream/70 transition-colors hover:border-gold hover:text-gold"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href={SITE.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-xs text-cream/70 transition-colors hover:border-gold hover:text-gold"
                >
                  X
                </a>
              </div>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs uppercase tracking-wide text-cream/40 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} {SITE.name}</p>
          <LiveClock />
          <p>{t('footer.crafted')}</p>
        </div>

        <p className="mt-6 text-center text-xs uppercase tracking-wide text-cream/40">
          {t('footer.poweredBy')}{' '}
          <a
            href="https://b12ventures.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cream/60 transition-colors hover:text-gold"
          >
            B12 Internet Ventures
          </a>
        </p>
      </div>
    </footer>
  );
}
