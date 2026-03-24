import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Check, Trash2 } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { formatPrice } from '../utils/currency';
import Button from '../components/common/Button';
import type { Product } from '../types/product.types';
import './Wishlist.css';

const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = useCallback((product: Product) => {
    addToCart(product);
    showToast(`${product.title.substring(0, 40)} added to cart`, 'success');
  }, [addToCart, showToast]);

  const handleAddAllToCart = useCallback(() => {
    let added = 0;
    wishlist.forEach((product) => {
      if (!isInCart(product.id)) {
        addToCart(product);
        added++;
      }
    });
    if (added > 0) {
      showToast(`${added} item${added > 1 ? 's' : ''} added to cart`, 'success');
    }
  }, [wishlist, addToCart, isInCart, showToast]);

  const handleRemove = useCallback((product: Product) => {
    removeFromWishlist(product.id);
    showToast(`${product.title.substring(0, 40)} removed`, 'info');
  }, [removeFromWishlist, showToast]);

  if (wishlist.length === 0) {
    return (
      <div className="empty-wishlist">
        <Heart size={48} strokeWidth={1} className="empty-wishlist__icon" aria-hidden />
        <h2 className="empty-wishlist__title">Your wishlist is empty</h2>
        <p className="empty-wishlist__text">Save items you love for later.</p>
        <Link to="/shop">
          <Button size="large">Explore Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <div>
          <h1 className="wishlist-page__title">My Wishlist</h1>
          <p className="wishlist-page__count">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        <div className="wishlist-actions">
          <Button variant="outline" onClick={handleAddAllToCart}>
            Add All to Cart
          </Button>
          <Button variant="danger" onClick={clearWishlist}>
            Clear Wishlist
          </Button>
        </div>
      </div>

      <div className="wishlist-grid">
        {wishlist.map((product) => (
          <div key={product.id} className="wishlist-item">
            <div className="wishlist-item__image">
              <img src={product.image} alt={product.title} loading="lazy" />
            </div>

            <div className="wishlist-item__info">
              <p className="wishlist-item__category">{product.category}</p>
              <h3 className="wishlist-item__title">{product.title}</h3>
              <div className="wishlist-item__rating">
                <Star size={12} strokeWidth={1.5} fill="currentColor" aria-hidden />
                <span>{product.rating.rate.toFixed(1)}</span>
                <span className="wishlist-item__rating-count">({product.rating.count})</span>
              </div>
              <p className="wishlist-item__price">{formatPrice(product.price)}</p>
            </div>

            <div className="wishlist-item__actions">
              {isInCart(product.id) ? (
                <div className="wishlist-item__in-cart">
                  <Check size={14} strokeWidth={2} aria-hidden />
                  In Cart
                </div>
              ) : (
                <Button fullWidth onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </Button>
              )}
              <button
                className="wishlist-item__remove"
                onClick={() => handleRemove(product)}
                aria-label={`Remove ${product.title} from wishlist`}
                type="button"
              >
                <Trash2 size={14} strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
