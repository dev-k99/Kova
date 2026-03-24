import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types/product.types';

const MAX_ITEMS = 8;

interface RecentlyViewedState {
  items: Product[];
  addProduct: (product: Product) => void;
  clearAll: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],

      addProduct: (product) =>
        set((state) => {
          const filtered = state.items.filter((p) => p.id !== product.id);
          return { items: [product, ...filtered].slice(0, MAX_ITEMS) };
        }),

      clearAll: () => set({ items: [] }),
    }),
    {
      name: 'recently-viewed',
    }
  )
);
