'use client';

/**
 * Kitchen order alert — a loud, repeating doorbell chime synthesised with Web
 * Audio (no audio file needed) plus an optional OS/browser notification as a
 * visual backup. Browsers only allow audio after a user gesture, so the context
 * must be primed (the dashboard primes on login and on the first interaction).
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

/** True only when the browser will actually play sound right now. */
export function isAudioReady(): boolean {
  return !!ctx && ctx.state === 'running';
}

function ding(at: number, freq: number, dur = 0.3, vol = 0.6) {
  if (!ctx) return;
  const t = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

/**
 * Play the alert: a bright "ding-dong" doorbell, repeated so it carries across
 * a noisy kitchen. Returns false if audio is blocked (so the UI can nudge).
 */
export function playAlert(): boolean {
  if (!ctx) primeAudio();
  if (!ctx || ctx.state !== 'running') return false;
  // Two rounds of a rising 3-note bell.
  [0, 0.85].forEach((base) => {
    ding(base + 0.0, 880, 0.28, 0.6);
    ding(base + 0.16, 1175, 0.28, 0.6);
    ding(base + 0.34, 1568, 0.42, 0.65);
  });
  return true;
}

/* ── Browser notifications (visual backup even if muted / tab hidden) ── */

export function requestNotify() {
  try {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  } catch {
    /* ignore */
  }
}

export function notifyNewOrder(title: string, body: string) {
  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      const n = new Notification(title, { body, tag: 'pc-order', requireInteraction: true });
      n.onclick = () => { window.focus(); n.close(); };
    }
  } catch {
    /* ignore */
  }
}
