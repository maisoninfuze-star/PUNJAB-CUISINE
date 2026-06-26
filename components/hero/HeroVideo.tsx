'use client';

import { useEffect, useRef, useState } from 'react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useLenis } from '@/components/providers/SmoothScroll';
import { useI18n } from '@/lib/i18n';

/**
 * Cinematic scroll-scrubbed hero. A short clip is pinned via position:sticky;
 * scroll progress drives video.currentTime through an rAF lerp so the footage
 * scrubs like a timeline (Locomotive-style) without hijacking the wheel.
 * Reduced motion / missing video degrades to the static poster.
 */
export function HeroVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);
  const [hasVideo, setHasVideo] = useState(true);
  const targetTime = useRef(0);
  const rafActive = useRef(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Headline + chrome ride the scroll subtly (parallax + fade as the clip pushes in).
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);
  const scrimOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.85]);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Smoothly chase the scroll-derived target time for jitter-free scrubbing.
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const v = videoRef.current;
    if (!v || reduced || !v.duration) return;
    targetTime.current = Math.min(v.duration - 0.05, p * v.duration);
    if (!rafActive.current) {
      rafActive.current = true;
      const step = () => {
        const vid = videoRef.current;
        if (!vid) { rafActive.current = false; return; }
        const cur = vid.currentTime;
        const diff = targetTime.current - cur;
        if (Math.abs(diff) < 0.01) { rafActive.current = false; return; }
        vid.currentTime = cur + diff * 0.18;
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  });

  return (
    <section ref={sectionRef} className="relative h-[260vh]">
      {/* Pinned cinematic stage */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Video / poster */}
        {hasVideo && !reduced ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src="/hero/hero.mp4"
            poster="/hero/hero-poster.jpg"
            muted
            playsInline
            preload="auto"
            onError={() => setHasVideo(false)}
            onLoadedMetadata={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/hero/hero-poster.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Cinematic grading */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/50"
          style={{ opacity: scrimOpacity }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,transparent_30%,rgba(10,10,10,0.9)_100%)]" />
        {/* Film grain */}
        <div className="noise pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" />

        {/* Corner chrome — kept low so it never collides with the headline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.9 }}
          style={{ opacity: titleOpacity }}
          className="container-editorial absolute inset-x-0 bottom-7 z-10 hidden items-end justify-between md:flex"
        >
          <CornerChrome />
        </motion.div>

        {/* Centered editorial headline (balky-style) */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="container-editorial absolute inset-0 z-10 flex flex-col items-center justify-center text-center"
        >
          <Headline />

          {/* Horizontal rule */}
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 block h-px w-[min(420px,70vw)] origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.9 }}
            className="mt-6 font-sans text-xs uppercase tracking-label text-cream/60"
          >
            <Tagline />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.9 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <HeroCtas />
          </motion.div>
        </motion.div>

        {/* Scroll cue — centered bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          style={{ opacity: titleOpacity }}
          className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2.5"
        >
          <ScrollLabel />
          <span className="h-12 w-px overflow-hidden bg-white/15">
            <span className="block h-1/2 w-full animate-[scrolldot_2.2s_ease-in-out_infinite] bg-gold" />
          </span>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes scrolldot {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  );
}

function Headline() {
  const { t, lang } = useI18n();
  const lines = [t('hero.l1'), t('hero.l2'), t('hero.l3')];
  // The brand word "Punjabi" is line 2 in EN, line 3 in FR.
  const accentIndex = lang === 'fr' ? 2 : 1;
  return (
    <h1 className="font-display font-semibold uppercase leading-[0.86] tracking-[-0.02em] text-cream">
      {lines.map((word, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block text-[19vw] md:text-[14vw] lg:text-[12rem]"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5 + i * 0.13, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {i === accentIndex ? (
              <span className="font-accent italic text-gold">{word}</span>
            ) : (
              word
            )}
          </motion.span>
        </span>
      ))}
      <span className="sr-only">{t('hero.sub')}</span>
    </h1>
  );
}

function CornerChrome() {
  const { t } = useI18n();
  return (
    <>
      <span className="font-sans text-[0.65rem] uppercase tracking-label text-cream/40">
        {t('hero.eyebrow')}
      </span>
      <span className="text-right font-sans text-[0.65rem] uppercase tracking-label text-cream/40">
        {t('hero.coords')}
      </span>
    </>
  );
}

function Tagline() {
  const { t } = useI18n();
  return <>{t('loader.tagline')}</>;
}

function ScrollLabel() {
  const { t } = useI18n();
  return <span className="text-[0.6rem] uppercase tracking-label text-cream/45">{t('hero.scroll')}</span>;
}

function HeroCtas() {
  const { scrollTo } = useLenis();
  const { t } = useI18n();
  return (
    <>
      <a
        href="#visit"
        onClick={(e) => { e.preventDefault(); scrollTo('#visit'); }}
        className="btn-gold"
      >
        {t('hero.reserve')}
      </a>
      <TransitionLink href="/order" className="btn-ghost">
        {t('hero.order')}
      </TransitionLink>
      <a
        href="#menu"
        onClick={(e) => { e.preventDefault(); scrollTo('#menu'); }}
        className="group inline-flex items-center gap-2 px-2 py-3 text-sm text-cream/80 transition-colors hover:text-gold"
      >
        {t('hero.viewMenu')}
        <span className="h-px w-6 bg-gold transition-all duration-300 group-hover:w-10" />
      </a>
    </>
  );
}
