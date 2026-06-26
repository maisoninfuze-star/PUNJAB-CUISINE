'use client';

/**
 * Tiny Web-Audio alert tone for the kitchen. No audio files needed — a short
 * two-note chime synthesised on demand. Must be primed by a user gesture
 * (the login click) before browsers will allow playback.
 */
let ctx: AudioContext | null = null;

export function primeAudio() {
  if (typeof window === 'undefined') return;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (AC) ctx = new AC();
  }
  ctx?.resume().catch(() => {});
}

export function playAlert() {
  if (!ctx) primeAudio();
  if (!ctx) return;
  const now = ctx.currentTime;
  // Two rising bell-like tones.
  [
    [880, 0],
    [1175, 0.18],
    [880, 0.36],
  ].forEach(([freq, at]) => {
    const osc = ctx!.createOscillator();
    const gain = ctx!.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq as number;
    gain.gain.setValueAtTime(0.0001, now + (at as number));
    gain.gain.exponentialRampToValueAtTime(0.5, now + (at as number) + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (at as number) + 0.16);
    osc.connect(gain).connect(ctx!.destination);
    osc.start(now + (at as number));
    osc.stop(now + (at as number) + 0.18);
  });
}
