'use client';

import { Reveal } from '@/components/ui/Reveal';
import { RevealText } from '@/components/ui/RevealText';
import { useI18n } from '@/lib/i18n';

const PILLARS = [
  { no: '01', titleKey: 'exp.p1.title', bodyKey: 'exp.p1.body' },
  { no: '02', titleKey: 'exp.p2.title', bodyKey: 'exp.p2.body' },
  { no: '03', titleKey: 'exp.p3.title', bodyKey: 'exp.p3.body' },
] as const;

export function Experience() {
  const { t } = useI18n();
  return (
    <section id="experience" className="relative overflow-hidden bg-ink py-28 md:py-44">
      <span className="ghost-word absolute -right-[5vw] top-8 text-[22vw] md:text-[16vw]">
        PUNJAB
      </span>

      <div className="container-editorial relative">
        {/* Editorial split: statement left, pillars right */}
        <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <p className="eyebrow mb-7">{t('exp.eyebrow')}</p>
            </Reveal>
            <RevealText
              as="h2"
              className="font-display text-[2.6rem] font-medium leading-[1.04] tracking-[-0.02em] text-cream md:text-[4.5rem]"
              lines={[
                <>{t('exp.h1')}</>,
                <>{t('exp.h2')}</>,
                <><span className="font-accent italic text-gold">{t('exp.h3')}</span></>,
              ]}
            />
            <Reveal delay={140}>
              <p className="mt-8 max-w-sm text-base leading-relaxed text-cream/55">
                {t('exp.body')}
              </p>
            </Reveal>
          </div>

          {/* Numbered list, hairline-divided — no boxed cards */}
          <div className="divide-y divide-white/10 border-t border-white/10">
            {PILLARS.map((p, i) => (
              <Reveal key={p.no} delay={i * 120}>
                <div className="group grid grid-cols-[auto_1fr] gap-6 py-9 md:gap-10">
                  <span className="font-display text-2xl text-gold/50 transition-colors duration-500 group-hover:text-gold">
                    {p.no}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl text-cream md:text-3xl">
                      {t(p.titleKey)}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/55 md:text-base">
                      {t(p.bodyKey)}
                    </p>
                    <span className="mt-5 block h-px w-0 bg-gold transition-all duration-700 ease-expo group-hover:w-20" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
