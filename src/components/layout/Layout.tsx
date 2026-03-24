import React, { type ReactNode } from 'react';
import { ErrorBoundary } from '../common/ErrorBoundary';
import Header from './Header';
import Footer from './Footer';
import Toast from '../common/Toast';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="layout">
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <Header />
    <main id="main-content" className="main-content">
      <ErrorBoundary>{children}</ErrorBoundary>
    </main>
    <Footer />
    <Toast />
  </div>
);

export default Layout;
