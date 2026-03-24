import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types/product.types';

interface WishlistState {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product) => {
        if (get().isInWishlist(product.id)) return;
        set((state) => ({ items: [...state.items, product] }));
      },

      removeFromWishlist: (productId) => {
        set((state) => ({
          items: state.items.filter((p) => p.id !== productId),
        }));
      },

      isInWishlist: (productId) =>
        get().items.some((p) => p.id === productId),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist',
    }
  )
);
