import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  fullScreen = false,
}) => (
  <div
    className={fullScreen ? 'spinner-container--fullscreen' : 'spinner-container'}
    role="status"
    aria-label="Loading"
  >
    <div className={`spinner spinner--${size}`} aria-hidden />
  </div>
);

export default LoadingSpinner;
