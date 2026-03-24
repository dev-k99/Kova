import React from 'react';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyCart from '../components/cart/EmptyCart';
import './Cart.css';

const Cart: React.FC = () => {
  const { cart } = useCart();

  if (cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Shopping Cart</h1>
      
      <div className="cart-layout">
        <div className="cart-items">
          <div className="cart-items-header">
            <h2>Items ({cart.totalItems})</h2>
          </div>
          <div className="cart-items-list">
            {cart.items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>
        </div>

        <div className="cart-sidebar">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default Cart;