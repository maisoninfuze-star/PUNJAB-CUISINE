'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Reveal } from '@/components/ui/Reveal';
import { RevealText } from '@/components/ui/RevealText';
import { DishImage } from '@/components/ui/DishImage';
import { useI18n } from '@/lib/i18n';

export function Story() {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const badgeY = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);

  return (
    <section id="story" className="relative bg-ink-800 py-28 md:py-40">
      <div className="container-editorial grid items-center gap-14 md:grid-cols-2 md:gap-20">
        {/* Image column */}
        <div ref={ref} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <motion.div style={{ y: imgY }} className="absolute inset-[-8%]">
              <DishImage
                src="/story/heritage.jpg"
                alt="Chef pressing fresh naan beside a glowing tandoor"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </div>

          {/* Floating overlap badge */}
          <motion.div
            style={{ y: badgeY }}
            className="absolute -bottom-8 -right-4 hidden w-44 rounded-xl border border-gold/30 bg-ink/90 p-5 backdrop-blur-md md:block"
          >
            <p className="font-display text-4xl text-gold">28</p>
            <p className="mt-1 text-xs leading-snug text-cream/60">
              {t('story.badge')}
            </p>
          </motion.div>
        </div>

        {/* Text column */}
        <div>
          <Reveal>
            <p className="eyebrow mb-6">{t('story.eyebrow')}</p>
          </Reveal>
          <RevealText
            as="h2"
            className="font-display text-3xl font-medium leading-[1.15] text-cream md:text-5xl"
            lines={[
              <>{t('story.h1')}</>,
              <><span className="font-accent italic text-gold">{t('story.h2')}</span></>,
            ]}
          />
          <Reveal delay={120}>
            <p className="mt-8 text-base leading-relaxed text-cream/70">
              {t('story.body1')}
            </p>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-5 text-base leading-relaxed text-cream/70">
              {t('story.body2')}
            </p>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-10 flex items-center gap-6">
              <div className="h-px flex-1 bg-gradient-to-r from-gold/60 to-transparent" />
              <span className="font-accent text-2xl italic text-cream/80">
                Sat Sri Akal
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
