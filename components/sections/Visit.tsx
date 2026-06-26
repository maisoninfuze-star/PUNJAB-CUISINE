'use client';

import { TransitionLink } from '@/components/ui/TransitionLink';
import { MapPin, Phone, Clock, ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { RevealText } from '@/components/ui/RevealText';
import { DishImage } from '@/components/ui/DishImage';
import { SITE } from '@/lib/site';
import { useI18n } from '@/lib/i18n';

export function Visit() {
  const { t, lang } = useI18n();
  const mapsQuery = encodeURIComponent(
    `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region}`
  );

  return (
    <section id="visit" className="relative overflow-hidden bg-ink-800 py-28 md:py-40">
      <div className="container-editorial grid gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Left — details */}
        <div>
          <Reveal>
            <p className="eyebrow mb-6">{t('visit.eyebrow')}</p>
          </Reveal>
          <RevealText
            as="h2"
            className="font-display text-3xl font-medium leading-[1.15] text-cream md:text-5xl"
            lines={[<>{t('visit.h1')}</>, <><span className="font-accent italic text-gold">{t('visit.h2')}</span></>]}
          />

          <Reveal delay={120}>
            <p className="mt-7 max-w-md text-base leading-relaxed text-cream/70">
              {t('visit.body')}
            </p>
          </Reveal>

          <div className="mt-10 space-y-6">
            <Reveal delay={160} className="flex items-start gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
              <div>
                <p className="text-cream">{SITE.address.street}</p>
                <p className="text-cream/60">
                  {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
                </p>
                <a
                  href={`https://maps.google.com/?q=${mapsQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-sm text-gold hover:text-gold-light"
                >
                  {t('visit.directions')} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </Reveal>

            <Reveal delay={220} className="flex items-start gap-4">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
              <div className="space-y-1">
                {SITE.hours.map((h) => (
                  <div key={h.days} className="flex gap-6 text-sm">
                    <span className="w-40 text-cream/60">{lang === 'fr' ? h.daysFr : h.days}</span>
                    <span className="text-cream">{lang === 'fr' ? h.timeFr : h.time}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={280} className="flex items-start gap-4">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
              <a href={`tel:${SITE.phoneHref}`} className="text-cream hover:text-gold">
                {SITE.phoneDisplay}
              </a>
            </Reveal>
          </div>

          <Reveal delay={340}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href={`tel:${SITE.phoneHref}`} className="btn-gold">
                {t('visit.call')}
              </a>
              <TransitionLink href="/order" className="btn-ghost">
                {t('visit.order')}
              </TransitionLink>
            </div>
          </Reveal>
        </div>

        {/* Right — interior image with map link */}
        <Reveal delay={120} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <DishImage
              src="/story/interior.jpg"
              alt="Warm candle-lit interior of Punjabi Cuisine"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <a
              href={`https://maps.google.com/?q=${mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-ink/70 px-5 py-3 text-sm text-cream backdrop-blur-md transition-colors hover:border-gold hover:text-gold"
            >
              <MapPin className="h-4 w-4" /> {t('visit.map')}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
