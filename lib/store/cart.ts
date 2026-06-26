'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MenuItem } from '@/lib/menu';

export interface CartLine {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

interface CartState {
  lines: CartLine[];
  /** Transient flag to flash the cart UI when an item is added. */
  lastAddedId: string | null;
  add: (item: MenuItem, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  setNotes: (id: string, notes: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      lastAddedId: null,
      add: (item, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.item.id === item.id);
          const lines = existing
            ? state.lines.map((l) =>
                l.item.id === item.id
                  ? { ...l, quantity: l.quantity + quantity }
                  : l
              )
            : [...state.lines, { item, quantity }];
          return { lines, lastAddedId: item.id };
        }),
      setQuantity: (id, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.item.id !== id)
              : state.lines.map((l) =>
                  l.item.id === id ? { ...l, quantity } : l
                ),
        })),
      setNotes: (id, notes) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.item.id === id ? { ...l, notes } : l
          ),
        })),
      remove: (id) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.item.id !== id),
        })),
      clear: () => set({ lines: [], lastAddedId: null }),
    }),
    { name: 'pc-cart' }
  )
);

/** Derived selectors. */
export const selectCount = (s: CartState) =>
  s.lines.reduce((n, l) => n + l.quantity, 0);

export const selectSubtotal = (s: CartState) =>
  s.lines.reduce((sum, l) => sum + l.item.price * l.quantity, 0);
