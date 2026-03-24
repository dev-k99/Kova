import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Truck, Lock, Gem, Zap, ArrowRight } from 'lucide-react';
import { productsApi, productQueryKeys } from '../api/products';
import { useRecentlyViewedStore } from '../store/recentlyViewedStore';
import { formatPrice } from '../utils/currency';
import Button from '../components/common/Button';
import ProductCard from '../components/products/ProductCard';
import './Home.css';

const FEATURES = [
  { icon: <Truck size={22} strokeWidth={1.5} aria-hidden />,  title: 'Free Shipping',    desc: 'On orders over R1 850' },
  { icon: <Gem  size={22} strokeWidth={1.5} aria-hidden />,  title: 'Premium Quality',   desc: 'Curated products only' },
  { icon: <Lock size={22} strokeWidth={1.5} aria-hidden />,  title: 'Secure Checkout',   desc: 'Powered by Paystack' },
  { icon: <Zap  size={22} strokeWidth={1.5} aria-hidden />,  title: 'Fast Delivery',     desc: 'Express shipping available' },
];

const Home: React.FC = () => {
  const { data: products = [] } = useQuery({
    queryKey: productQueryKeys.lists(),
    queryFn: productsApi.getAll,
  });

  const recentlyViewed = useRecentlyViewedStore((s) => s.items);

  // Pick 4 visually varied hero products across different categories
  const featuredProducts = React.useMemo(() => {
    const seen = new Set<string>();
    return products
      .filter((p) => {
        if (seen.has(p.category)) return false;
        seen.add(p.category);
        return true;
      })
      .slice(0, 4);
  }, [products]);

  return (
    <div className="home">
      {/* ─── Hero ───────────────────────────────────────────── */}
      <section className="hero" aria-label="Hero">
        <div className="hero__content">
          <p className="hero__eyebrow">New Arrivals 2026</p>
          <h1 className="hero__heading">
            <span>Discover</span>
            <span>Your Style</span>
          </h1>
          <p className="hero__body">
            A curated edit of premium products across fashion, tech, and lifestyle.
            Free shipping on orders over R1 850.
          </p>
          <div className="hero__actions">
            <Link to="/shop">
              <Button size="large">
                Shop Now
                <ArrowRight size={18} strokeWidth={1.5} aria-hidden />
              </Button>
            </Link>
          </div>
        </div>

        {featuredProducts.length > 0 && (
          <div className="hero__grid">
            {featuredProducts.map((product, i) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className={`hero__product hero__product--${i + 1}`}
                aria-label={`Shop ${product.category}`}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="hero__product-image"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
                <div className="hero__product-label">
                  <span>{product.category}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ─── Features ───────────────────────────────────────── */}
      <section className="features" aria-label="Store features">
        {FEATURES.map(({ icon, title, desc }) => (
          <div key={title} className="feature">
            <div className="feature__icon" aria-hidden>{icon}</div>
            <div className="feature__text">
              <h3 className="feature__title">{title}</h3>
              <p className="feature__desc">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ─── Featured Products ───────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="featured" aria-label="Featured products">
          <div className="featured__header">
            <h2 className="featured__title">Featured</h2>
            <Link to="/shop" className="featured__link">
              View all <ArrowRight size={14} strokeWidth={1.5} aria-hidden />
            </Link>
          </div>
          <div className="featured__grid">
            {products.slice(0, 8).map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="featured__item"
                aria-label={product.title}
              >
                <div className="featured__image-wrap">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="featured__image"
                    loading="lazy"
                  />
                </div>
                <div className="featured__item-info">
                  <p className="featured__item-category">{product.category}</p>
                  <p className="featured__item-title">{product.title}</p>
                  <p className="featured__item-price">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── CTA Banner ─────────────────────────────────────── */}
      <section className="cta-banner" aria-label="Call to action">
        <div className="cta-banner__inner">
          <h2 className="cta-banner__heading">Ready to shop?</h2>
          <p className="cta-banner__body">
            Browse the full collection and find your next favourite.
          </p>
          <Link to="/shop">
            <Button variant="outline" size="large">
              Explore All Products
              <ArrowRight size={18} strokeWidth={1.5} aria-hidden />
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── Recently Viewed ─────────────────────────────────── */}
      {recentlyViewed.length > 0 && (
        <section className="recently-viewed" aria-label="Recently viewed products">
          <div className="recently-viewed__header">
            <h2 className="recently-viewed__title">Recently Viewed</h2>
          </div>
          <div className="recently-viewed__grid">
            {recentlyViewed.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
