import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer__inner">
      <div className="footer__brand">
        <Link to="/" className="footer__logo" aria-label="Kova — Home">
          <ShoppingBag size={18} strokeWidth={1.5} aria-hidden />
          <span>Kova</span>
        </Link>
        <p className="footer__tagline">
          Premium products, curated for modern living.
        </p>
        <div className="footer__social">
          <a href="#" className="footer__social-link" rel="noopener noreferrer">Instagram</a>
          <a href="#" className="footer__social-link" rel="noopener noreferrer">Twitter</a>
          <a href="#" className="footer__social-link" rel="noopener noreferrer">Facebook</a>
        </div>
      </div>

      <nav className="footer__col" aria-label="Shop links">
        <h3 className="footer__col-heading">Shop</h3>
        <ul className="footer__links">
          <li><Link to="/shop" className="footer__link">All Products</Link></li>
          <li><Link to="/shop" className="footer__link">Electronics</Link></li>
          <li><Link to="/shop" className="footer__link">Jewellery</Link></li>
          <li><Link to="/shop" className="footer__link">Men's Clothing</Link></li>
          <li><Link to="/shop" className="footer__link">Women's Clothing</Link></li>
        </ul>
      </nav>

      <nav className="footer__col" aria-label="Company links">
        <h3 className="footer__col-heading">Company</h3>
        <ul className="footer__links">
          <li><a href="#" className="footer__link">About</a></li>
          <li><a href="#" className="footer__link">Careers</a></li>
          <li><a href="#" className="footer__link">Press</a></li>
          <li><a href="#" className="footer__link">Contact</a></li>
          <li><Link to="/admin" className="footer__link footer__link--admin">Admin</Link></li>
        </ul>
      </nav>

      <nav className="footer__col" aria-label="Legal links">
        <h3 className="footer__col-heading">Legal</h3>
        <ul className="footer__links">
          <li><a href="#" className="footer__link">Privacy Policy</a></li>
          <li><a href="#" className="footer__link">Terms of Service</a></li>
          <li><a href="#" className="footer__link">Cookie Policy</a></li>
          <li><a href="#" className="footer__link">Returns &amp; Refunds</a></li>
        </ul>
      </nav>
    </div>

    <div className="footer__bottom">
      <p className="footer__copy">
        &copy; {new Date().getFullYear()} Kova. Built with React &amp; TypeScript.
      </p>
      <p className="footer__payments">Payments secured by Paystack</p>
    </div>
  </footer>
);

export default Footer;
