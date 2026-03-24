import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Button from '../common/Button';
import './EmptyCart.css';

const EmptyCart: React.FC = () => (
  <div className="empty-cart">
    <ShoppingCart size={48} strokeWidth={1} className="empty-cart__icon" aria-hidden />
    <h2 className="empty-cart__title">Your cart is empty</h2>
    <p className="empty-cart__text">
      Add items to your cart to get started.
    </p>
    <Link to="/shop">
      <Button size="large">Browse Products</Button>
    </Link>
  </div>
);

export default EmptyCart;
