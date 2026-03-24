import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, Heart, Check, ShoppingCart, ChevronRight, Minus, Plus } from 'lucide-react';
import { productsApi, productQueryKeys } from '../api/products';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useToast } from '../hooks/useToast';
import { useRecentlyViewedStore } from '../store/recentlyViewedStore';
import { formatPrice } from '../utils/currency';
import ProductGrid from '../components/products/ProductGrid';
import './ProductDetail.css';

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23E8E8E4'/%3E%3C/svg%3E";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const productId = parseInt(id ?? '', 10);

  // Guard invalid ID
  useEffect(() => {
    if (isNaN(productId)) navigate('/shop', { replace: true });
  }, [productId, navigate]);

  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const addProduct = useRecentlyViewedStore((s) => s.addProduct);

  const [qty, setQty] = useState(1);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: productQueryKeys.detail(productId),
    queryFn: () => productsApi.getById(productId),
    enabled: !isNaN(productId),
  });

  // Related products — reuse cached list, zero extra network requests
  const { data: allProducts = [] } = useQuery({
    queryKey: productQueryKeys.lists(),
    queryFn: productsApi.getAll,
    enabled: !isNaN(productId),
  });

  const related = React.useMemo(
    () =>
      allProducts
        .filter((p) => p.category === product?.category && p.id !== productId)
        .slice(0, 4),
    [allProducts, product?.category, productId]
  );

  // Record view once product is loaded
  useEffect(() => {
    if (product) addProduct(product);
  }, [product, addProduct]);

  const inCart = product ? isInCart(product.id) : false;
  const inWishlist = product ? isInWishlist(product.id) : false;
  const cartQty = product ? getItemQuantity(product.id) : 0;

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addToCart(product, qty);
    showToast(`${product.title.slice(0, 32)}… added to cart`, 'success');
  }, [product, qty, addToCart, showToast]);

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

  // ── Loading skeleton ────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="product-detail">
        <div className="product-detail__skeleton">
          <div className="product-detail__skeleton-image" />
          <div className="product-detail__skeleton-info">
            <div className="skeleton-pulse" style={{ width: '80px', height: '12px' }} />
            <div className="skeleton-pulse" style={{ width: '100%', height: '36px', marginTop: '12px' }} />
            <div className="skeleton-pulse" style={{ width: '60%', height: '36px', marginTop: '4px' }} />
            <div className="skeleton-pulse" style={{ width: '120px', height: '28px', marginTop: '16px' }} />
            <div className="skeleton-pulse" style={{ width: '100%', height: '80px', marginTop: '24px' }} />
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────
  if (isError || !product) {
    return (
      <div className="product-detail">
        <div className="product-detail__error">
          <p className="product-detail__error-text">Could not load this product.</p>
          <Link to="/shop" className="product-detail__back-link">← Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      {/* ── Breadcrumb ─────────────────────────────────── */}
      <nav className="product-detail__breadcrumb" aria-label="Breadcrumb">
        <Link to="/" className="product-detail__crumb">Home</Link>
        <ChevronRight size={14} strokeWidth={1.5} className="product-detail__crumb-sep" aria-hidden />
        <Link to="/shop" className="product-detail__crumb">Shop</Link>
        <ChevronRight size={14} strokeWidth={1.5} className="product-detail__crumb-sep" aria-hidden />
        <Link
          to={`/shop?category=${encodeURIComponent(product.category)}`}
          className="product-detail__crumb"
        >
          {product.category}
        </Link>
        <ChevronRight size={14} strokeWidth={1.5} className="product-detail__crumb-sep" aria-hidden />
        <span className="product-detail__crumb product-detail__crumb--current" aria-current="page">
          {product.title.length > 40 ? product.title.slice(0, 40) + '…' : product.title}
        </span>
      </nav>

      {/* ── Two-column layout ──────────────────────────── */}
      <div className="product-detail__layout">
        {/* Left — image */}
        <div className="product-detail__image-frame">
          <img
            src={product.image}
            alt={product.title}
            className="product-detail__image"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
              (e.currentTarget as HTMLImageElement).onerror = null;
            }}
          />
        </div>

        {/* Right — info panel */}
        <div className="product-detail__info">
          <p className="product-detail__category">{product.category}</p>
          <h1 className="product-detail__title">{product.title}</h1>

          <div className="product-detail__rating">
            <Star size={14} strokeWidth={0} fill="currentColor" aria-hidden />
            <span>{product.rating.rate.toFixed(1)}</span>
            <span className="product-detail__rating-count">({product.rating.count} reviews)</span>
          </div>

          <p className="product-detail__price">{formatPrice(product.price)}</p>

          <p className="product-detail__description">{product.description}</p>

          {/* Quantity */}
          <div className="product-detail__qty-row">
            <span className="product-detail__qty-label">Quantity</span>
            <div className="product-detail__qty-controls">
              <button
                className="product-detail__qty-btn"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                type="button"
                aria-label="Decrease quantity"
              >
                <Minus size={14} strokeWidth={2} />
              </button>
              <span className="product-detail__qty-value" aria-live="polite">{qty}</span>
              <button
                className="product-detail__qty-btn"
                onClick={() => setQty((q) => q + 1)}
                type="button"
                aria-label="Increase quantity"
              >
                <Plus size={14} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="product-detail__actions">
            <button
              className={`product-detail__add-btn${inCart ? ' product-detail__add-btn--in-cart' : ''}`}
              onClick={handleAddToCart}
              type="button"
            >
              {inCart ? (
                <>
                  <Check size={16} strokeWidth={2} aria-hidden />
                  In Cart ({cartQty})
                </>
              ) : (
                <>
                  <ShoppingCart size={16} strokeWidth={1.5} aria-hidden />
                  Add to Cart
                </>
              )}
            </button>
            <button
              className={`product-detail__wishlist-btn${inWishlist ? ' product-detail__wishlist-btn--active' : ''}`}
              onClick={handleWishlistToggle}
              type="button"
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={inWishlist}
            >
              <Heart
                size={18}
                strokeWidth={1.5}
                fill={inWishlist ? 'currentColor' : 'none'}
                aria-hidden
              />
            </button>
          </div>

          {/* Meta */}
          <dl className="product-detail__meta">
            <div className="product-detail__meta-row">
              <dt>SKU</dt>
              <dd>KV-{String(product.id).padStart(4, '0')}</dd>
            </div>
            <div className="product-detail__meta-row">
              <dt>Category</dt>
              <dd>
                <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>
                  {product.category}
                </Link>
              </dd>
            </div>
            <div className="product-detail__meta-row">
              <dt>Rating</dt>
              <dd>{product.rating.rate} / 5 ({product.rating.count} reviews)</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* ── Related products ───────────────────────────── */}
      {related.length > 0 && (
        <section className="product-detail__related" aria-label="Related products">
          <h2 className="product-detail__related-title">You may also like</h2>
          <ProductGrid products={related} skeletonCount={4} />
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
