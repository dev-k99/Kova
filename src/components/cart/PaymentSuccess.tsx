import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import './PaymentSuccess.css';

interface PaymentSuccessProps {
  reference: string;
  onClose: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ reference, onClose }) => (
  <div className="payment-success">
    <div className="payment-success__icon">
      <CheckCircle size={56} strokeWidth={1.5} aria-hidden />
    </div>
    <h2 className="payment-success__title">Order Confirmed</h2>
    <p className="payment-success__message">
      Your payment was processed successfully. You will receive a confirmation email shortly.
    </p>
    <p className="payment-success__ref">
      Reference: <span>{reference}</span>
    </p>
    <div className="payment-success__actions">
      <Link to="/shop" onClick={onClose}>
        <Button>Continue Shopping</Button>
      </Link>
    </div>
  </div>
);

export default PaymentSuccess;
