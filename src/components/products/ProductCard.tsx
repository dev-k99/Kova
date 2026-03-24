import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Check, Eye } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useToast } from '../../hooks/useToast';
import { formatPrice } from '../../utils/currency';
import type { Product } from '../../types/product.types';
import Button from '../common/Button';
import './ProductCard.css';

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23E8E8E4'/%3E%3C/svg%3E";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const inCart     = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);
  const quantity   = getItemQuantity(product.id);

  const handleAddToCart = useCallback(() => {
    addToCart(product);
    showToast(`${product.title.substring(0, 40)} added to cart`, 'success');
  }, [product, addToCart, showToast]);

  const handleWishlistToggle = useCallback(() => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      showToast('Added to wishlist', 'success');
    }
  }, [inWishlist, product, addToWishlist, removeFromWishlist, showToast]);

  return (
    <article className="product-card">
      <Link
        to={`/product/${product.id}`}
        className="product-card__media-link"
        tabIndex={-1}
        aria-hidden
      >
        <div className="product-card__media">
          <img
            src={product.image}
            alt={product.title}
            className="product-card__image"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER;
              (e.target as HTMLImageElement).onerror = null;
            }}
          />
          <button
            className={`product-card__wishlist ${inWishlist ? 'product-card__wishlist--active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleWishlistToggle(); }}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            type="button"
            tabIndex={0}
          >
            <Heart
              size={16}
              strokeWidth={1.5}
              fill={inWishlist ? 'currentColor' : 'none'}
              aria-hidden
            />
          </button>
          <div className="product-card__rating" aria-label={`Rating: ${product.rating.rate}`}>
            <Star size={12} strokeWidth={1.5} fill="currentColor" aria-hidden />
            <span>{product.rating.rate.toFixed(1)}</span>
            <span className="product-card__rating-count">({product.rating.count})</span>
          </div>
          {onQuickView && (
            <button
              className="product-card__quickview"
              onClick={(e) => { e.preventDefault(); onQuickView(product); }}
              type="button"
              tabIndex={0}
            >
              <Eye size={14} strokeWidth={1.5} aria-hidden />
              Quick View
            </button>
          )}
        </div>
      </Link>

      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <Link to={`/product/${product.id}`} className="product-card__title-link">
          <h3 className="product-card__title">{product.title}</h3>
        </Link>

        <div className="product-card__footer">
          <span className="product-card__price">{formatPrice(product.price)}</span>

          {inCart ? (
            <div className="product-card__in-cart" aria-label={`In cart, quantity ${quantity}`}>
              <Check size={14} strokeWidth={2} aria-hidden />
              <span>In cart ({quantity})</span>
            </div>
          ) : (
            <Button size="small" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};

export default React.memo(ProductCard);
