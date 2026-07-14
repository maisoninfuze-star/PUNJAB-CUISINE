/**
 * North-American (NANP) phone helpers — client-safe (no server deps). Used to
 * reject junk numbers at checkout and sign-up, and to store/display a clean,
 * consistent format so staff can actually call the customer back.
 *
 * This validates that a number is well-formed and callable. It does NOT prove
 * the customer owns it — that requires an SMS one-time-code (see docs / Twilio).
 */
export function phoneDigits(input: string): string {
  return (input || '').replace(/\D/g, '');
}

/** Return the 10-digit number, or null if it isn't a valid NANP number. */
export function normalizePhone(input: string): string | null {
  let d = phoneDigits(input);
  if (d.length === 11 && d.startsWith('1')) d = d.slice(1);
  if (d.length !== 10) return null;
  // NANP: area code and exchange code can't start with 0 or 1.
  if (d[0] === '0' || d[0] === '1' || d[3] === '0' || d[3] === '1') return null;
  return d;
}

export function isValidPhone(input: string): boolean {
  return normalizePhone(input) !== null;
}

/** Pretty display form, e.g. (514) 684-2000. Falls back to the raw input. */
export function formatPhone(input: string): string {
  const d = normalizePhone(input);
  return d ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : input;
}
