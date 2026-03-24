import React, { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { formatCurrency } from '../../utils/currency';
import Button from '../common/Button';
import PaymentSuccess from './PaymentSuccess';
import PaymentFailed from './PaymentFailed';
import type { PaymentStatus, CustomerInfo } from '../../types/order.types';
import './CheckoutModal.css';

const USD_TO_ZAR = parseFloat(import.meta.env.VITE_USD_TO_ZAR_RATE ?? '18.5');
const PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ?? '';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  discountRate?: number;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, discountRate = 0 }) => {
  const { cart, clearCart } = useCart();
  const { showToast } = useToast();

  const [status, setStatus]               = useState<PaymentStatus>('idle');
  const [paymentRef, setPaymentRef]       = useState('');
  const [customerInfo, setCustomerInfo]   = useState<CustomerInfo>({
    email: '',
    firstName: '',
    lastName: '',
  });

  const rawSubtotalZAR = cart.totalPrice * USD_TO_ZAR;
  const discountZAR    = rawSubtotalZAR * discountRate;
  const subtotalZAR    = rawSubtotalZAR - discountZAR;
  const shippingZAR    = subtotalZAR > 1850 ? 0 : 185;
  const taxZAR         = subtotalZAR * 0.15; // 15% VAT (South Africa)
  const totalZAR       = subtotalZAR + shippingZAR + taxZAR;

  const reference = `kova_${Date.now()}`;

  const config = {
    reference,
    email: customerInfo.email,
    amount: Math.round(totalZAR * 100),
    publicKey: PUBLIC_KEY,
    currency: 'ZAR',
    metadata: {
      custom_fields: [
        {
          display_name: 'Customer Name',
          variable_name: 'customer_name',
          value: `${customerInfo.firstName} ${customerInfo.lastName}`,
        },
      ],
    },
  };

  const initializePayment = usePaystackPayment(config);

  const handleFieldChange = useCallback(
    (field: keyof CustomerInfo) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerInfo((prev) => ({ ...prev, [field]: e.target.value }));
      },
    []
  );

  const handlePay = () => {
    setStatus('processing');
    initializePayment({
      onSuccess: (reference: { reference: string }) => {
        setPaymentRef(reference.reference);
        clearCart();
        showToast('Order confirmed. Thank you for your purchase.', 'success');
        setStatus('success');
      },
      onClose: () => {
        setStatus('idle');
      },
    });
  };

  const handleRetry = () => setStatus('idle');

  const handleClose = () => {
    setStatus('idle');
    onClose();
  };

  const isFormValid =
    customerInfo.email.includes('@') &&
    customerInfo.firstName.trim().length > 0 &&
    customerInfo.lastName.trim().length > 0;

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="modal">
        {status !== 'success' && (
          <button
            className="modal__close"
            onClick={handleClose}
            aria-label="Close checkout"
            type="button"
          >
            <X size={20} strokeWidth={1.5} aria-hidden />
          </button>
        )}

        {status === 'success' && (
          <PaymentSuccess reference={paymentRef} onClose={handleClose} />
        )}

        {status === 'failed' && (
          <PaymentFailed onRetry={handleRetry} onClose={handleClose} />
        )}

        {(status === 'idle' || status === 'processing') && (
          <div className="modal__body">
            <h2 className="modal__title">Checkout</h2>

            <div className="checkout-form">
              <div className="checkout-form__row">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">First name</label>
                  <input
                    id="firstName"
                    type="text"
                    className="form-input"
                    value={customerInfo.firstName}
                    onChange={handleFieldChange('firstName')}
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">Last name</label>
                  <input
                    id="lastName"
                    type="text"
                    className="form-input"
                    value={customerInfo.lastName}
                    onChange={handleFieldChange('lastName')}
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  value={customerInfo.email}
                  onChange={handleFieldChange('email')}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="order-summary">
              <h3 className="order-summary__title">Order Summary</h3>
              <div className="order-summary__items">
                {cart.items.map((item) => (
                  <div key={item.product.id} className="order-item">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="order-item__image"
                      loading="lazy"
                    />
                    <div className="order-item__info">
                      <p className="order-item__title">{item.product.title}</p>
                      <p className="order-item__qty">Qty: {item.quantity}</p>
                    </div>
                    <span className="order-item__price">
                      {formatCurrency(item.product.price * item.quantity * USD_TO_ZAR, 'ZAR')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-summary__totals">
                <div className="totals-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(rawSubtotalZAR, 'ZAR')}</span>
                </div>
                {discountRate > 0 && (
                  <div className="totals-row totals-row--discount">
                    <span>Discount ({Math.round(discountRate * 100)}%)</span>
                    <span>−{formatCurrency(discountZAR, 'ZAR')}</span>
                  </div>
                )}
                <div className="totals-row">
                  <span>Shipping</span>
                  <span className={shippingZAR === 0 ? 'totals-row__free' : ''}>
                    {shippingZAR === 0 ? 'Free' : formatCurrency(shippingZAR, 'ZAR')}
                  </span>
                </div>
                <div className="totals-row">
                  <span>VAT (15%)</span>
                  <span>{formatCurrency(taxZAR, 'ZAR')}</span>
                </div>
                <div className="totals-row totals-row--total">
                  <span>Total</span>
                  <span>{formatCurrency(totalZAR, 'ZAR')}</span>
                </div>
              </div>
            </div>

            <Button
              fullWidth
              onClick={handlePay}
              loading={status === 'processing'}
              loadingText="Processing..."
              disabled={!isFormValid || status === 'processing'}
            >
              Pay {formatCurrency(totalZAR, 'ZAR')}
            </Button>

            <p className="checkout-secure">
              Secured by Paystack. Your payment details are never stored.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
