import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { productsApi, productQueryKeys } from '../api/products';
import type { Product } from '../types/product.types';
import ProductGrid from '../components/products/ProductGrid';
import QuickView from '../components/products/QuickView';
import Button from '../components/common/Button';
import './Shop.css';

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery      = searchParams.get('q')        ?? '';
  const selectedCategory = searchParams.get('category') ?? 'all';
  const sortBy           = searchParams.get('sort')     ?? 'name';

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [debouncedSearch] = useDebounce(searchQuery, 300);

  const updateParam = (key: string, value: string, defaultValue: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === defaultValue) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        return next;
      },
      { replace: true }
    );
  };

  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
    refetch,
  } = useQuery({
    queryKey: productQueryKeys.lists(),
    queryFn: productsApi.getAll,
  });

  const { data: categories = [] } = useQuery({
    queryKey: productQueryKeys.categories(),
    queryFn: productsApi.getCategories,
  });

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      default:
        result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [products, selectedCategory, debouncedSearch, sortBy]);

  if (productsError) {
    return (
      <div className="error-container">
        <h2>Unable to load products</h2>
        <p>Check your connection and try again.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="shop">
      <div className="shop__header">
        <h1 className="shop__title">All Products</h1>
        <p className="shop__subtitle">{products.length} items</p>
      </div>

      <div className="shop__filters">
        <div className="filter-group">
          <label htmlFor="search" className="filter-label">Search</label>
          <input
            id="search"
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => updateParam('q', e.target.value, '')}
            className="filter-input"
            aria-label="Search products"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category" className="filter-label">Category</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => updateParam('category', e.target.value, 'all')}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort" className="filter-label">Sort by</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => updateParam('sort', e.target.value, 'name')}
            className="filter-select"
          >
            <option value="name">Name (A–Z)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {!productsLoading && (
        <p className="shop__count">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      )}

      <ProductGrid
        products={filteredProducts}
        isLoading={productsLoading}
        skeletonCount={8}
        onQuickView={setQuickViewProduct}
      />

      <QuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default Shop;
