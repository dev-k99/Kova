import React from 'react';
import { XCircle } from 'lucide-react';
import Button from '../common/Button';
import './PaymentFailed.css';

interface PaymentFailedProps {
  onRetry: () => void;
  onClose: () => void;
}

const PaymentFailed: React.FC<PaymentFailedProps> = ({ onRetry, onClose }) => (
  <div className="payment-failed">
    <div className="payment-failed__icon">
      <XCircle size={56} strokeWidth={1.5} aria-hidden />
    </div>
    <h2 className="payment-failed__title">Payment Unsuccessful</h2>
    <p className="payment-failed__message">
      Something went wrong with your payment. No charges have been made.
    </p>
    <div className="payment-failed__actions">
      <Button onClick={onRetry}>Try Again</Button>
      <Button variant="outline" onClick={onClose}>Return to Cart</Button>
    </div>
  </div>
);

export default PaymentFailed;
