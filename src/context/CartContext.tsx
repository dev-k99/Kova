// State migrated to src/store/cartStore.ts (Zustand + persist)
// This file is kept as a bridge so any legacy imports continue to resolve.

import React, { type ReactNode } from 'react';

export { useCart } from '../hooks/useCart';

// No-op provider — Zustand stores initialise themselves, no provider needed.
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <>{children}</>
);
