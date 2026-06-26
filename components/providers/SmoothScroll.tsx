'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface LenisContextValue {
  lenis: Lenis | null;
  /** Smoothly scroll to a target (selector, element, or offset). */
  scrollTo: (target: string | HTMLElement | number, offset?: number) => void;
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  scrollTo: () => {},
});

export const useLenis = () => useContext(LenisContext);

/**
 * Momentum smooth-scroll provider. Drives a single rAF loop that powers both
 * Lenis and GSAP ScrollTrigger so every scroll-linked animation stays in sync.
 * Degrades to native scroll when prefers-reduced-motion is set.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduced) {
      setReady(true);
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;
    setReady(true);

    // Keep ScrollTrigger in lockstep with Lenis via a single rAF loop.
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo: LenisContextValue['scrollTo'] = (target, offset = -80) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target as never, { offset, duration: 1.4 });
    } else if (typeof target === 'string') {
      document
        .querySelector(target)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}
