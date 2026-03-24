import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingCart, Check, Heart, ArrowRight } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useToast } from '../../hooks/useToast';
import { formatPrice } from '../../utils/currency';
import type { Product } from '../../types/product.types';
import './QuickView.css';

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23E8E8E4'/%3E%3C/svg%3E";

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

const QuickView: React.FC<QuickViewProps> = ({ product, onClose }) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const inCart     = product ? isInCart(product.id) : false;
  const inWishlist = product ? isInWishlist(product.id) : false;
  const quantity   = product ? getItemQuantity(product.id) : 0;

  // Body scroll lock + Escape key
  useEffect(() => {
    if (!product) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', handleKey);
    };
  }, [product, onClose]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addToCart(product);
    showToast(`${product.title.substring(0, 40)} added to cart`, 'success');
  }, [product, addToCart, showToast]);

  const handleWishlistToggle = useCallback(() => {
    if (!product) return;
    if (inWishlist) {
      removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      showToast('Added to wishlist', 'success');
    }
  }, [product, inWishlist, addToWishlist, removeFromWishlist, showToast]);

  if (!product) return null;

  return (
    <div
      className="quickview-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={product.title}
    >
      <div className="quickview">
        <button
          className="quickview__close"
          onClick={onClose}
          type="button"
          aria-label="Close quick view"
        >
          <X size={18} strokeWidth={1.5} aria-hidden />
        </button>

        {/* ── Image ──────────────────────────────────────── */}
        <div className="quickview__image-frame">
          <img
            src={product.image}
            alt={product.title}
            className="quickview__image"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
              (e.currentTarget as HTMLImageElement).onerror = null;
            }}
          />
        </div>

        {/* ── Info ───────────────────────────────────────── */}
        <div className="quickview__info">
          <p className="quickview__category">{product.category}</p>
          <h2 className="quickview__title">{product.title}</h2>

          <div className="quickview__rating">
            <Star size={13} strokeWidth={1.5} fill="currentColor" aria-hidden />
            <span>{product.rating.rate.toFixed(1)}</span>
            <span className="quickview__rating-count">({product.rating.count})</span>
          </div>

          <p className="quickview__price">{formatPrice(product.price)}</p>

          <p className="quickview__description">{product.description}</p>

          {/* Actions */}
          <div className="quickview__actions">
            <button
              className={`quickview__add-btn${inCart ? ' quickview__add-btn--in-cart' : ''}`}
              onClick={handleAddToCart}
              type="button"
            >
              {inCart ? (
                <>
                  <Check size={15} strokeWidth={2} aria-hidden />
                  In Cart ({quantity})
                </>
              ) : (
                <>
                  <ShoppingCart size={15} strokeWidth={1.5} aria-hidden />
                  Add to Cart
                </>
              )}
            </button>
            <button
              className={`quickview__wishlist-btn${inWishlist ? ' quickview__wishlist-btn--active' : ''}`}
              onClick={handleWishlistToggle}
              type="button"
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={inWishlist}
            >
              <Heart size={16} strokeWidth={1.5} fill={inWishlist ? 'currentColor' : 'none'} aria-hidden />
            </button>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="quickview__detail-link"
            onClick={onClose}
          >
            View Full Details
            <ArrowRight size={14} strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
