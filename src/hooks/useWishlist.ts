import { useWishlistStore } from '../store/wishlistStore';

export const useWishlist = () => {
  const items = useWishlistStore((state) => state.items);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  return {
    wishlist: items,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };
};
