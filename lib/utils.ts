import { clsx, type ClassValue } from 'clsx';

/** Conditional className join. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format a number as CAD currency. */
export function formatPrice(value: number) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
  }).format(value);
}
