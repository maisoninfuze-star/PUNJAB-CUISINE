'use client';

import { Reveal } from '@/components/ui/Reveal';
import { RevealImage } from '@/components/ui/RevealImage';
import { useI18n } from '@/lib/i18n';

/**
 * Editorial mosaic — the Zimmerl "label + photo grid" gallery device. A
 * mixed-aspect bento of atmosphere and plates, each tile wiping open on scroll.
 * Reuses existing renders; no new photography required.
 */
const TILES = [
  { src: '/story/spices.jpg', alt: 'Whole spices on dark slate', span: 'md:col-span-7 md:row-span-2', ratio: 'aspect-[4/3] md:aspect-auto md:h-full', from: 'left' as const },
  { src: '/menu/whole-tandoori-chicken.jpg', alt: 'Tandoori chicken', span: 'md:col-span-5', ratio: 'aspect-[4/5]' },
  { src: '/story/interior.jpg', alt: 'Candle-lit dining room', span: 'md:col-span-5', ratio: 'aspect-[4/3]' },
  { src: '/menu/chole-bhatura.jpg', alt: 'Chole bhatura', span: 'md:col-span-4', ratio: 'aspect-square' },
  { src: '/og.jpg', alt: 'A Punjabi spread', span: 'md:col-span-8', ratio: 'aspect-[16/10]' },
  { src: '/menu/gulab-jamun.jpg', alt: 'Gulab jamun', span: 'md:col-span-4', ratio: 'aspect-square' },
];

export function Gallery() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-ink py-24 md:py-32">
      <div className="container-editorial">
        <Reveal className="mb-14">
          <p className="eyebrow mb-5">{t('gallery.eyebrow')}</p>
          <h2 className="font-display text-[2.6rem] font-semibold uppercase leading-[0.92] tracking-[-0.02em] text-cream md:text-7xl">
            {t('gallery.h1')} <span className="font-accent italic capitalize text-gold">{t('gallery.h1accent')}</span>
            <br className="hidden md:block" /> {t('gallery.h2')}
          </h2>
        </Reveal>

        <div className="grid auto-rows-[minmax(0,1fr)] grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
          {TILES.map((t, i) => (
            <div key={t.src} className={t.span}>
              <RevealImage
                src={t.src}
                alt={t.alt}
                from={t.from ?? 'bottom'}
                delay={(i % 3) * 80}
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`group h-full w-full rounded-xl ${t.ratio}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
