import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, Heart, Menu, X } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import './Header.css';

const Header: React.FC = () => {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => { if (sentinel) observer.unobserve(sentinel); };
  }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div ref={sentinelRef} style={{ height: 1, position: 'absolute', top: 0 }} aria-hidden />
      <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
        <div className="header__inner">
          <Link to="/" className="header__logo" aria-label="Kova — Home">
            <ShoppingBag size={20} strokeWidth={1.5} aria-hidden />
            <span>Kova</span>
          </Link>

          <nav className="header__nav" aria-label="Main navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `header__link${isActive ? ' header__link--active' : ''}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) => `header__link${isActive ? ' header__link--active' : ''}`}
            >
              Shop
            </NavLink>
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `header__link header__link--icon${isActive ? ' header__link--active' : ''}`
              }
              aria-label={`Wishlist${wishlist.length > 0 ? `, ${wishlist.length} items` : ''}`}
            >
              <Heart size={18} strokeWidth={1.5} aria-hidden />
              {wishlist.length > 0 && (
                <span className="header__badge" aria-hidden>{wishlist.length}</span>
              )}
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `header__link header__link--icon${isActive ? ' header__link--active' : ''}`
              }
              aria-label={`Cart${cart.totalItems > 0 ? `, ${cart.totalItems} items` : ''}`}
            >
              <ShoppingCart size={18} strokeWidth={1.5} aria-hidden />
              {cart.totalItems > 0 && (
                <span className="header__badge" aria-hidden>{cart.totalItems}</span>
              )}
            </NavLink>
          </nav>

          <button
            className="header__hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            type="button"
          >
            {menuOpen
              ? <X size={22} strokeWidth={1.5} />
              : <Menu size={22} strokeWidth={1.5} />
            }
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="header__mobile-menu" role="dialog" aria-label="Navigation menu">
          <nav className="header__mobile-nav">
            <NavLink to="/" end className="header__mobile-link" onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/shop" className="header__mobile-link" onClick={() => setMenuOpen(false)}>
              Shop
            </NavLink>
            <NavLink to="/wishlist" className="header__mobile-link" onClick={() => setMenuOpen(false)}>
              Wishlist
              {wishlist.length > 0 && <span className="header__badge">{wishlist.length}</span>}
            </NavLink>
            <NavLink to="/cart" className="header__mobile-link" onClick={() => setMenuOpen(false)}>
              Cart
              {cart.totalItems > 0 && <span className="header__badge">{cart.totalItems}</span>}
            </NavLink>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
