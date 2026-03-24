// State migrated to src/store/wishlistStore.ts (Zustand + persist)
// This file is kept as a bridge so any legacy imports continue to resolve.

import React, { type ReactNode } from 'react';

export { useWishlist } from '../hooks/useWishlist';

// No-op provider — Zustand stores initialise themselves, no provider needed.
export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <>{children}</>
);
