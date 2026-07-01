'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogoEmblem } from '@/components/brand/Logo';
import { useLenis } from '@/components/providers/SmoothScroll';
import { useI18n } from '@/lib/i18n';

/** Seeded pseudo-random so particle layout is stable between renders. */
function seeded(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface LoaderProps {
  onComplete?: () => void;
}

/**
 * Cinematic intro: black screen → golden particles drift up → the gold emblem
 * rises into focus as a soft light sweeps across it → the curtain lifts into
 * the homepage. Honors prefers-reduced-motion.
 */
export function Loader({ onComplete }: LoaderProps) {
  const [visible, setVisible] = useState(true);
  const [removed, setRemoved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { lenis } = useLenis();
  const { t } = useI18n();

  useEffect(() => setMounted(true), []);

  // Dismiss on ANY user interaction — guarantees the user is never trapped
  // behind the overlay even if timers are throttled (embedded webviews pause
  // background setTimeout/rAF, which can otherwise leave the intro stuck).
  useEffect(() => {
    const dismiss = () => setVisible(false);
    const opts = { passive: true } as AddEventListenerOptions;
    const events = ['wheel', 'touchstart', 'pointerdown', 'keydown', 'scroll'];
    events.forEach((e) => window.addEventListener(e, dismiss, opts));
    return () => events.forEach((e) => window.removeEventListener(e, dismiss, opts));
  }, []);

  // Safety net: force-unmount shortly after hiding, even if the framer-motion
  // exit animation never fires onExitComplete (e.g. interrupted / throttled).
  useEffect(() => {
    if (visible) return;
    const t = setTimeout(() => setRemoved(true), 1100);
    return () => clearTimeout(t);
  }, [visible]);

  const particles = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        left: seeded(i) * 100,
        size: 1 + seeded(i + 50) * 2.5,
        delay: seeded(i + 100) * 1.2,
        duration: 2.4 + seeded(i + 150) * 2.4,
        drift: (seeded(i + 200) - 0.5) * 60,
      })),
    []
  );

  // One-shot reveal timer — empty deps so it fires exactly once and can never
  // be reset by context/identity churn (that was freezing the loader open).
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const total = reduced ? 300 : 2600;
    const timer = setTimeout(() => setVisible(false), total);
    return () => clearTimeout(timer);
  }, []);

  // Lock scroll while visible; restore the instant it hides — independent of
  // the exit animation completing, so a hung/interrupted exit can't freeze the
  // page with overflow:hidden + Lenis stopped.
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      document.body.style.overflow = '';
      lenis?.start();
    }
  }, [visible, lenis]);

  function handleExitComplete() {
    document.body.style.overflow = '';
    lenis?.start();
    onComplete?.();
  }

  if (removed) return null;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
        >
          {/* Warm vignette */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.12),transparent_62%)]" />

          {/* Golden particles drifting up */}
          {mounted &&
            particles.map((p, i) => (
              <motion.span
                key={i}
                className="absolute bottom-0 rounded-full bg-gold-light"
                style={{
                  left: `${p.left}%`,
                  width: p.size,
                  height: p.size,
                  boxShadow: '0 0 8px rgba(232,201,109,0.8)',
                }}
                initial={{ y: 0, opacity: 0 }}
                animate={{
                  y: [-20, -window.innerHeight * 0.7],
                  x: [0, p.drift],
                  opacity: [0, 0.9, 0],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            ))}

          <div className="relative flex flex-col items-center">
            {/* Emblem rises in with a light sweep */}
            <motion.div
              className="relative overflow-hidden rounded-full"
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <LogoEmblem size={188} priority />
              <motion.span
                className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                initial={{ x: '-130%' }}
                animate={{ x: '130%' }}
                transition={{ delay: 1.1, duration: 1.1, ease: 'easeInOut' }}
              />
            </motion.div>

            <motion.span
              className="mt-7 font-sans text-[0.62rem] uppercase tracking-label text-cream/45"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              {t('loader.tagline')}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
