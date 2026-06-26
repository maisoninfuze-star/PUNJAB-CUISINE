'use client';

import { RevealText } from '@/components/ui/RevealText';
import { Reveal } from '@/components/ui/Reveal';
import { useI18n } from '@/lib/i18n';

/**
 * Centered manifesto beat — the Zimmerl "poetic text block" device. Big
 * editorial type, deep whitespace, a single italic accent. No imagery; it lets
 * the page breathe between visual sections.
 */
export function Manifesto() {
  const { t } = useI18n();
  return (
    <section className="relative bg-ink py-32 md:py-48">
      <div className="container-editorial flex flex-col items-center text-center">
        <Reveal>
          <p className="eyebrow mb-10">{t('manifesto.eyebrow')}</p>
        </Reveal>

        <RevealText
          as="h2"
          stagger={110}
          className="max-w-4xl font-display text-[2.1rem] font-medium leading-[1.16] tracking-[-0.015em] text-cream md:text-[3.6rem]"
          lines={[
            <>{t('manifesto.l1')}</>,
            <>{t('manifesto.l2')}</>,
            <><span className="font-accent italic text-gold">{t('manifesto.l3')}</span></>,
          ]}
        />

        <Reveal delay={160}>
          <p className="mx-auto mt-10 max-w-xl text-base leading-relaxed text-cream/55 md:text-lg">
            {t('manifesto.body')}
          </p>
        </Reveal>

        <Reveal delay={260} className="mt-14">
          <div className="mx-auto h-10 w-px bg-gradient-to-b from-gold to-transparent" />
        </Reveal>
      </div>
    </section>
  );
}
