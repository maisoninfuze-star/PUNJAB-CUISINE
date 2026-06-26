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
  const [mounted, setMounted] = useState(false);
  const { lenis } = useLenis();
  const { t } = useI18n();

  useEffect(() => setMounted(true), []);

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

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.style.overflow = 'hidden';
    lenis?.stop();
    const total = reduced ? 300 : 2800;
    const timer = setTimeout(() => setVisible(false), total);
    return () => clearTimeout(timer);
  }, [lenis]);

  function handleExitComplete() {
    document.body.style.overflow = '';
    lenis?.start();
    onComplete?.();
  }

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
