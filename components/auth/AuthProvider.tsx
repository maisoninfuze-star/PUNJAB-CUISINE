'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { PublicCustomer } from '@/lib/customer';

interface AuthValue {
  customer: PublicCustomer | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (input: {
    email: string;
    name: string;
    phone: string;
    password: string;
    marketingOptIn: boolean;
  }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue>({
  customer: null,
  loading: true,
  login: async () => ({ ok: false }),
  signup: async () => ({ ok: false }),
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<PublicCustomer | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from the session cookie on mount.
  useEffect(() => {
    let alive = true;
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => { if (alive) setCustomer(d.customer ?? null); })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error || 'error' };
    setCustomer(data.customer);
    return { ok: true };
  }, []);

  const signup = useCallback(
    async (input: { email: string; name: string; phone: string; password: string; marketingOptIn: boolean }) => {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return { ok: false, error: data.error || 'error' };
      setCustomer(data.customer);
      return { ok: true };
    },
    []
  );

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setCustomer(null);
  }, []);

  return (
    <AuthContext.Provider value={{ customer, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
