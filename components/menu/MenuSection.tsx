'use client';

import { Reveal } from '@/components/ui/Reveal';
import { MenuExplorer } from './MenuExplorer';
import { useI18n } from '@/lib/i18n';

export function MenuSection() {
  const { t } = useI18n();
  return (
    <section id="menu" className="relative bg-ink py-24 md:py-32">
      <div className="container-editorial">
        <Reveal className="mb-4 text-center">
          <p className="eyebrow mb-5">{t('menu.eyebrow')}</p>
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-medium text-cream md:text-5xl">
            {t('menu.h1')}{' '}
            <span className="font-accent italic text-gold">{t('menu.h1accent')}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-cream/55">
            {t('menu.sub')}
          </p>
        </Reveal>

        <div className="mt-10">
          <MenuExplorer />
        </div>
      </div>
    </section>
  );
}
