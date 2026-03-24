import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import './App.css';

const Home           = lazy(() => import('./pages/Home'));
const Shop           = lazy(() => import('./pages/Shop'));
const Cart           = lazy(() => import('./pages/Cart'));
const Wishlist       = lazy(() => import('./pages/Wishlist'));
const ProductDetail  = lazy(() => import('./pages/ProductDetail'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFound       = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
    },
  },
});

const App: React.FC = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Router>
          <Layout>
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <Routes>
                <Route path="/"       element={<Home />} />
                <Route path="/shop"   element={<Shop />} />
                <Route path="/cart"   element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/admin"  element={<AdminDashboard />} />
                <Route path="*"       element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </ToastProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
