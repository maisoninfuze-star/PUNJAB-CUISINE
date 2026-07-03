'use client';

import { useEffect, useRef, useState } from 'react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from 'framer-motion';
import { useLenis } from '@/components/providers/SmoothScroll';
import { LogoEmblem } from '@/components/brand/Logo';
import { useI18n } from '@/lib/i18n';

/**
 * Cinematic scroll-scrubbed "living dish" hero. A single locked-camera clip
 * (generated with Higgsfield/Seedance) morphs one copper handi through four
 * signature dishes — Butter Chicken → Palak Paneer → Lamb Curry → Dal Makhani —
 * then resolves into the brand lockup. Scroll progress scrubs video.currentTime
 * through an rAF lerp so the footage plays like a timeline. On touch / reduced
 * motion it gracefully autoplays instead of scrubbing.
 */

// Each dish label owns a window of scroll progress where it's fully lit.
const SCENES = [
  { key: 'Butter Chicken', note: 'Silken tomato-fenugreek makhani', at: 0.12 },
  { key: 'Palak Paneer', note: 'Spinach, cream & soft paneer', at: 0.37 },
  { key: 'Lamb Curry', note: 'Slow-cooked, robust & aromatic', at: 0.60 },
  { key: 'Dal Makhani', note: 'Black lentils simmered overnight', at: 0.83 },
];

export function HeroMorph() {
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

  const scrimOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [0.4, 0.4, 0.72]);
  // Brand chrome fades out as the final lockup takes over.
  const chromeOpacity = useTransform(scrollYProgress, [0, 0.7, 0.82], [1, 1, 0]);
  // Final logo lockup fades in over the last stretch.
  const lockupOpacity = useTransform(scrollYProgress, [0.82, 0.92], [0, 1]);
  const lockupY = useTransform(scrollYProgress, [0.82, 1], ['24px', '0px']);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Desktop pointer only: scrub the clip from scroll. Touch/reduced: autoplay.
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const v = videoRef.current;
    if (!v || reduced || !v.duration) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    targetTime.current = Math.min(v.duration - 0.05, p * v.duration);
    if (!rafActive.current) {
      rafActive.current = true;
      const step = () => {
        const vid = videoRef.current;
        if (!vid) { rafActive.current = false; return; }
        const cur = vid.currentTime;
        const diff = targetTime.current - cur;
        if (Math.abs(diff) < 0.01) { rafActive.current = false; return; }
        vid.currentTime = cur + diff * 0.16;
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  });

  return (
    <section ref={sectionRef} className="relative h-screen md:h-[460vh]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-ink">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-center"
          src="/hero/morph-sequence.mp4"
          poster="/hero/morph-poster.jpg"
          muted
          playsInline
          autoPlay
          loop
          preload="auto"
          controls={false}
          disablePictureInPicture
          onError={() => setHasVideo(false)}
          onLoadedMetadata={(e) => {
            // Real desktop pointer: pause so scroll drives the timeline.
            // Touch / reduced-motion: keep autoplaying+looping (a paused video
            // on touch is what makes iOS show its start-playback button).
            const desktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
            if (desktop && !reduced) {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            } else {
              e.currentTarget.play().catch(() => {});
            }
          }}
        />
        {!hasVideo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/hero/morph-poster.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}

        {/* Cinematic grading */}
        <motion.div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/40"
          style={{ opacity: scrimOpacity }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_35%,rgba(10,10,10,0.85)_100%)]" />
        <div className="noise pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" />


        {/* Persistent brand chrome — desktop scroll-scrub experience only */}
        <motion.div style={{ opacity: chromeOpacity }} className="pointer-events-none absolute inset-0 z-10 hidden md:block">
          <div className="container-editorial absolute inset-x-0 top-24 flex flex-col items-center text-center md:top-28">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.9 }}
              className="font-sans text-[0.62rem] uppercase tracking-label text-gold/80"
            >
              <Eyebrow />
            </motion.span>
          </div>

          {/* Dish scene labels — sit in the upper band, above the pot */}
          <div className="absolute inset-x-0 top-[17%] z-10 flex flex-col items-center text-center md:top-[19%]">
            {SCENES.map((s) => (
              <SceneLabel key={s.key} scene={s} progress={scrollYProgress} />
            ))}
          </div>
        </motion.div>

        {/* Final brand lockup — desktop, revealed at end of scroll */}
        <motion.div
          style={{ opacity: lockupOpacity, y: lockupY }}
          className="absolute inset-0 z-20 hidden flex-col items-center justify-center px-6 text-center md:flex"
        >
          <FinalLockup />
        </motion.div>

        {/* Mobile hero — static, complete (no scroll-scrub on phones) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center md:hidden"
        >
          <MobileHero />
        </motion.div>

        {/* Scroll cue — desktop only */}
        <motion.div
          style={{ opacity: chromeOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2.5 md:flex"
        >
          <ScrollLabel />
          <span className="h-12 w-px overflow-hidden bg-white/15">
            <span className="block h-1/2 w-full animate-[scrolldotm_2.2s_ease-in-out_infinite] bg-gold" />
          </span>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes scrolldotm {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  );
}

function SceneLabel({ scene, progress }: { scene: (typeof SCENES)[number]; progress: MotionValue<number> }) {
  // Light up as the dish forms, dim as the next morph begins.
  const w = 0.11; // half-width of the lit window
  const opacity = useTransform(
    progress,
    [scene.at - w, scene.at, scene.at + w],
    [0, 1, 0]
  );
  const y = useTransform(progress, [scene.at - w, scene.at + w], ['14px', '-14px']);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 flex flex-col items-center">
      <span className="mb-3 block h-px w-14 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <h2 className="font-display text-4xl font-semibold uppercase leading-none tracking-[-0.01em] text-cream md:text-6xl">
        {scene.key}
      </h2>
      <p className="mt-3 font-sans text-[0.7rem] uppercase tracking-label text-cream/55">{scene.note}</p>
    </motion.div>
  );
}

function Eyebrow() {
  const { t } = useI18n();
  return <>{t('hero.craftedLive')} · {t('loader.tagline')}</>;
}

function MobileHero() {
  const { t } = useI18n();
  const { scrollTo } = useLenis();
  return (
    <>
      <span className="mb-5 font-sans text-[0.6rem] uppercase tracking-label text-gold/80">
        {t('loader.tagline')}
      </span>
      <LogoEmblem size={92} priority className="drop-shadow-[0_8px_40px_rgba(201,168,76,0.3)]" />
      <h1 className="mt-5 font-display text-[clamp(2.3rem,11vw,3.4rem)] font-semibold uppercase leading-[0.9] tracking-[-0.02em] text-cream">
        {t('hero.l1')}
        <br />
        <span className="font-accent italic text-gold">{t('hero.l2')}</span> {t('hero.l3')}
      </h1>
      <span className="mt-5 block h-px w-40 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <p className="mt-4 max-w-[16rem] font-sans text-[0.68rem] uppercase leading-relaxed tracking-label text-cream/60">
        {t('hero.tagline2')}
      </p>
      <div className="mt-8 flex w-full max-w-xs flex-col items-stretch gap-3">
        <TransitionLink href="/order" className="btn-gold w-full justify-center">
          {t('hero.order')}
        </TransitionLink>
        <a
          href="#menu"
          onClick={(e) => { e.preventDefault(); scrollTo('#menu'); }}
          className="btn-ghost w-full justify-center"
        >
          {t('hero.viewMenu')}
        </a>
      </div>
    </>
  );
}

function ScrollLabel() {
  const { t } = useI18n();
  return <span className="text-[0.6rem] uppercase tracking-label text-cream/45">{t('hero.scroll')}</span>;
}

function FinalLockup() {
  const { t } = useI18n();
  const { scrollTo } = useLenis();
  return (
    <>
      <LogoEmblem size={128} priority className="drop-shadow-[0_8px_40px_rgba(201,168,76,0.25)]" />
      <h1 className="mt-6 font-display text-5xl font-semibold uppercase leading-[0.9] tracking-[-0.02em] text-cream md:text-7xl">
        {t('hero.l1')} <span className="font-accent italic text-gold">{t('hero.l2')}</span> {t('hero.l3')}
      </h1>
      <span className="mt-6 block h-px w-[min(360px,70vw)] bg-gradient-to-r from-transparent via-gold to-transparent" />
      <p className="mt-5 font-sans text-xs uppercase tracking-label text-cream/60">{t('hero.tagline2')}</p>
      <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
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
      </div>
    </>
  );
}
