import React from 'react';
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary';
import Button from './Button';
import './ErrorBoundary.css';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="error-fallback">
      <h2 className="error-fallback__title">Something went wrong</h2>
      <p className="error-fallback__message">
        {error instanceof Error ? error.message : 'An unexpected error occurred.'}
      </p>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  );
}

export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ReactErrorBoundary FallbackComponent={ErrorFallback}>
    {children}
  </ReactErrorBoundary>
);
