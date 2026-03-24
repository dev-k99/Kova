import React from 'react';
import { X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import './Toast.css';

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div
      className="toast-container"
      aria-live="polite"
      aria-atomic="true"
      role="status"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`} role="alert">
          <span className="toast__message">{toast.message}</span>
          <button
            className="toast__close"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
            type="button"
          >
            <X size={14} strokeWidth={2} aria-hidden />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
