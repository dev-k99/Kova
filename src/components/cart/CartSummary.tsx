import React, { useState, useCallback } from 'react';
import { Info, X } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/currency';
import Button from '../common/Button';
import CheckoutModal from './CheckoutModal';
import './CartSummary.css';

const FREE_SHIPPING_USD = 100; // ≈ R1 850 at current rate
const SHIPPING_USD      = 10;
const TAX_RATE          = 0.15; // 15% VAT (SA standard)

const PROMO_CODES: Record<string, number> = {
  KOVA10:       0.10,  // 10% off
  NEWCUSTOMER:  0.15,  // 15% off
};

const CartSummary: React.FC = () => {
  const { cart, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [promoInput, setPromoInput]     = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError]     = useState('');

  const discountRate   = appliedPromo ? (PROMO_CODES[appliedPromo] ?? 0) : 0;
  const discountAmount = cart.totalPrice * discountRate;
  const subtotal       = cart.totalPrice - discountAmount;
  const shipping       = subtotal >= FREE_SHIPPING_USD ? 0 : SHIPPING_USD;
  const tax            = subtotal * TAX_RATE;
  const total          = subtotal + shipping + tax;
  const isEmpty        = cart.items.length === 0;

  const handleApplyPromo = useCallback(() => {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code] !== undefined) {
      setAppliedPromo(code);
      setPromoError('');
      setPromoInput('');
    } else {
      setPromoError('Invalid promo code. Try KOVA10 or NEWCUSTOMER.');
    }
  }, [promoInput]);

  const handleRemovePromo = useCallback(() => {
    setAppliedPromo(null);
    setPromoError('');
  }, []);

  const handlePromoKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleApplyPromo();
    },
    [handleApplyPromo]
  );

  return (
    <>
      <div className="cart-summary">
        <h2 className="summary__title">Order Summary</h2>

        <div className="summary__row">
          <span>Subtotal ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})</span>
          <span>{formatPrice(cart.totalPrice)}</span>
        </div>

        {appliedPromo && (
          <div className="summary__row summary__row--discount">
            <span>Promo ({appliedPromo}) <button className="summary__remove-promo" onClick={handleRemovePromo} type="button" aria-label="Remove promo code"><X size={12} strokeWidth={2} /></button></span>
            <span>−{formatPrice(discountAmount)}</span>
          </div>
        )}

        <div className="summary__row">
          <span>Shipping</span>
          <span className={shipping === 0 ? 'summary__free' : ''}>
            {shipping === 0 ? 'Free' : formatPrice(SHIPPING_USD)}
          </span>
        </div>

        <div className="summary__row">
          <span>VAT (15%)</span>
          <span>{formatPrice(tax)}</span>
        </div>

        <div className="summary__divider" />

        <div className="summary__row summary__row--total">
          <span>Total (ZAR)</span>
          <span>{formatPrice(total)}</span>
        </div>

        {cart.totalPrice > 0 && subtotal < FREE_SHIPPING_USD && (
          <div className="summary__notice">
            <Info size={14} strokeWidth={1.5} aria-hidden />
            <span>Add {formatPrice(FREE_SHIPPING_USD - subtotal)} more for free shipping</span>
          </div>
        )}

        {/* ── Promo code ────────────────────────────────────── */}
        {!appliedPromo && (
          <div className="summary__promo">
            <div className="promo-row">
              <input
                type="text"
                className="promo-input"
                placeholder="Promo code"
                value={promoInput}
                onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); }}
                onKeyDown={handlePromoKeyDown}
                aria-label="Promo code"
              />
              <button
                className="promo-apply-btn"
                onClick={handleApplyPromo}
                type="button"
                disabled={!promoInput.trim()}
              >
                Apply
              </button>
            </div>
            {promoError && <p className="promo-error" role="alert">{promoError}</p>}
          </div>
        )}

        <Button
          fullWidth
          onClick={() => setIsCheckoutOpen(true)}
          disabled={isEmpty}
        >
          Proceed to Checkout
        </Button>

        <p className="summary__demo-note">
          Payment is in demo mode — no real charges will be made.
        </p>

        <Button
          fullWidth
          variant="outline"
          onClick={clearCart}
          disabled={isEmpty}
        >
          Clear Cart
        </Button>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        discountRate={discountRate}
      />
    </>
  );
};

export default CartSummary;
