import React, { useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { formatPrice } from '../../utils/currency';
import type { CartItem as CartItemType } from '../../types/cart.types';
import './CartItem.css';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();
  const { product, quantity } = item;

  const handleDecrease = useCallback(() => {
    if (quantity <= 1) {
      removeFromCart(product.id);
      showToast(`${product.title.substring(0, 40)} removed`, 'info');
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  }, [quantity, product, removeFromCart, updateQuantity, showToast]);

  const handleIncrease = useCallback(() => {
    updateQuantity(product.id, quantity + 1);
  }, [product.id, quantity, updateQuantity]);

  const handleRemove = useCallback(() => {
    removeFromCart(product.id);
    showToast(`${product.title.substring(0, 40)} removed`, 'info');
  }, [product, removeFromCart, showToast]);

  return (
    <article className="cart-item">
      <img
        src={product.image}
        alt={product.title}
        className="cart-item__image"
        loading="lazy"
      />

      <div className="cart-item__info">
        <p className="cart-item__category">{product.category}</p>
        <h3 className="cart-item__title">{product.title}</h3>
        <p className="cart-item__price">{formatPrice(product.price)}</p>
      </div>

      <div className="cart-item__controls">
        <div className="qty-controls">
          <button
            className="qty-btn"
            onClick={handleDecrease}
            aria-label="Decrease quantity"
            type="button"
          >
            −
          </button>
          <span className="qty-display" aria-label={`Quantity: ${quantity}`}>
            {quantity}
          </span>
          <button
            className="qty-btn"
            onClick={handleIncrease}
            aria-label="Increase quantity"
            type="button"
          >
            +
          </button>
        </div>

        <span className="cart-item__total">
          {formatPrice(product.price * quantity)}
        </span>

        <button
          className="cart-item__remove"
          onClick={handleRemove}
          aria-label={`Remove ${product.title}`}
          type="button"
        >
          <Trash2 size={16} strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    </article>
  );
};

export default React.memo(CartItem);
